from __future__ import print_function
import sys
import csv

import psycopg2


AUT_URL_TMPL = 'http://www.comedie-francaise.fr/la-grange-autorite.php?id=555&aut={aut_id}&ref=BIB00036570&p=1'
IMG_URL_TMPL = 'http://www.comedie-francaise.fr/lagrange/photos/{imgref}_{imgsize}.jpg'
BIB_URL_TMPL = 'http://www.comedie-francaise.fr/la-grange-notice.php?ref={docref}&id=555&p=1'


AUT_HDR_MAP = {
    'id': 'AUT_001',
    'etype': 'AUT_209_B',
    'birth_death_years': 'AUT_103_A',
    'mainrole': 'AUT_209_F',
    'mainform': 'AUT_200_A',
    'firstname1': 'AUT_200_B',
    'formcompl': 'AUT_200_C',
    'lastname': 'AUT_400_A',
    'firstname2': 'AUT_400_B',
}


DOC_HDR_MAP = {
    'id': 'DOC_REF',
    'etype': 'DOC_TYPE',
    'title': 'DOC_TITRE',
    'title2': 'DOC_TITRE2',
    'subtitle': 'DOC_SUBTITRE',
    'author_id': 'DOC_AUTEUR_3',
    'lname_autb': 'DOC_CAUTEUR_A',
    # 'fname_autb': 'DOC_CAUTEUR_B',
    'autsec': 'DOC_AUTEURSEC',
    'imgref': 'IMG_REF',
    'public': 'PHO_DISP_PUBLIC',
}


def decode(value, maxsize=256):
    if value is None:
        return None
    return value.decode('iso-8859-15')[:maxsize]


def compute_form(infos):
    firstname = infos['firstname1'] or infos['firstname2']
    if not infos['firstname1'] and infos['lastname']:
        lastname = infos['lastname']
    else:
        lastname = infos['mainform']
    infos['firstname'] = firstname
    infos['lastname'] = lastname
    computed = u'%s %s' % (infos['firstname'], infos['lastname'])
    computed = computed.lower().strip()
    return computed


def parse_author_listing(filepath):
    done = set()
    author_infos = []
    with open(filepath) as f:
        reader = csv.DictReader(f, delimiter='|')
        for i, elem in enumerate(reader, 1):
            infos = {k1: decode(elem[k2])
                     for k1, k2 in AUT_HDR_MAP.items()}
            if not infos['id'] or infos['id'] in done:
                continue
            if not infos['birth_death_years'] or infos['birth_death_years'][:2] not in ('14', '15', '16', '17'):
                continue
            done.add(infos['id'])
            if infos['id'].isdigit():
                aut_id = '%08d' % int(infos['id'])
            else:
                aut_id = infos['id']
            infos['computedform'] = compute_form(infos)
            infos['url'] = AUT_URL_TMPL.format(aut_id=aut_id)
            author_infos.append(infos)
    return author_infos


def parse_doc_listing(filepath, author_infos):
    done = set()
    doc_infos = []
    author_map = {infos['mainform']: infos['id']
                  for infos in author_infos}
    with open(filepath) as f:
        reader = csv.DictReader(f, delimiter='|')
        for elem in reader:
            infos = {k1: decode(elem[k2])
                     for k1, k2 in DOC_HDR_MAP.items()}
            if not infos['id'] or infos['id'] in done:
                continue
            done.add(infos['id'])
            if infos['id'].isdigit():
                bib_id = '%08d' % int(infos['id'])
            else:
                bib_id = infos['id']
            author_ids = set()
            author_id = infos.pop('author_id')
            if author_id:
                author_ids.add(author_id.lstrip('0'))
            author2 = infos.pop('lname_autb')
            if author2 and author2 in author_map:
                author_ids.add(author_map[author2].lstrip('0'))
            for autsec in infos.pop('autsec', '').split('<br>'):
                if '<link>' in autsec:
                    author_ids.add(autsec.split('<link>')[1].strip().lstrip('0'))
            infos['author_ids'] = list(author_ids)
            infos['url'] = BIB_URL_TMPL.format(docref=bib_id)
            public = infos.pop('public', '').strip() == '1'
            if infos['imgref'] and public:
                infos['imgurl'] = IMG_URL_TMPL.format(imgref=infos['imgref'].rsplit('.', 1)[0],
                                                      imgsize='moyenne')
            else:
                infos['imgurl'] = None
            doc_infos.append(infos)
    return doc_infos


def insert_author_infos(cnx, all_infos):
    cursor = cnx.cursor()
    try:
        cursor.execute('DROP TABLE IF EXISTS lagrange_authors')
        cursor.execute('''
CREATE TABLE lagrange_authors(
  id varchar(16) primary key,
  etype varchar(32),
  birth_death_years varchar(64),
  mainrole varchar(64),
  mainform varchar(64),
  firstname varchar(64),
  firstname1 varchar(64),
  formcompl varchar(64),
  lastname varchar(64),
  firstname2 varchar(64),
  computedform varchar(128),
  url varchar(128)
)
        ''')
        for field in ('mainrole', 'mainform', 'firstname', 'firstname1', 'formcompl',
                      'lastname', 'firstname2', 'computedform'):
            cursor.execute('CREATE INDEX lagrange_authors_{0}_idx ON lagrange_authors({0})'.format(field))
        keys = all_infos[0].keys()
        query = 'INSERT INTO lagrange_authors (%s) VALUES (%s)' % (
            ', '.join(keys),
            ', '.join('%%(%s)s' % k for k in keys),
        )
        cursor.executemany(query, all_infos)
    except:
        cnx.rollback()
        raise
    else:
        cnx.commit()


def insert_doc_infos(cnx, all_infos):
    cursor = cnx.cursor()
    try:
        cursor.execute('DROP TABLE IF EXISTS lagrange_docs')
        cursor.execute('''
CREATE TABLE lagrange_docs(
  id varchar(32) primary key,
  etype varchar(64),
  title varchar(256),
  title2 varchar(256),
  subtitle varchar(256),
  imgref varchar(128),
  imgurl varchar(128),
  url varchar(128)
)
        ''')
        for field in ('etype',):
            cursor.execute('CREATE INDEX lagrange_docs_{0}_idx ON lagrange_docs({0})'.format(field))
        keys = all_infos[0].keys()
        keys.remove('author_ids')
        query = 'INSERT INTO lagrange_docs (%s) VALUES (%s)' % (
            ', '.join(keys),
            ', '.join('%%(%s)s' % k for k in keys),
        )
        cursor.executemany(query, all_infos)
        cursor.execute('DROP TABLE IF EXISTS lagrange_doc_authors')
        cursor.execute('CREATE TABLE lagrange_doc_authors (doc_id varchar(32), aut_id varchar(32))')
        doc_authors = []
        for infos in all_infos:
            for author_id in infos['author_ids']:
                doc_authors.append({'d': infos['id'], 'a': author_id})
        cursor.executemany('INSERT INTO lagrange_doc_authors VALUES(%(d)s, %(a)s)', doc_authors)
        cursor.execute('CREATE INDEX lagrange_doc_authors_doc_idx ON lagrange_doc_authors(doc_id)')
        cursor.execute('CREATE INDEX lagrange_doc_authors_aut_idx ON lagrange_doc_authors(aut_id)')
    except:
        cnx.rollback()
        raise
    else:
        cnx.commit()


def align_authors(cnx):
    cursor = cnx.cursor()
    try:
        cursor.execute('DROP TABLE IF EXISTS rcf_lagrange_authors')
        cursor.execute('''
CREATE TABLE rcf_lagrange_authors AS
        SELECT pa.id person_id, la.id lagrange_id
        FROM person_agg pa, lagrange_authors la
        WHERE similarity(unaccent(lower(pa.givenname || ' ' || pa.familyname)), unaccent(lower(la.firstname || ' ' || la.lastname))) > 0.7
        ORDER BY pa.id
        ''')
        cursor.execute('CREATE INDEX rcf_lagrange_authors_rcf_idx ON rcf_lagrange_authors(person_id)')
        cursor.execute('CREATE INDEX rcf_lagrange_authors_lagrange_idx ON rcf_lagrange_authors(lagrange_id)')
        cursor.execute("INSERT INTO rcf_lagrange_authors VALUES(2, '96')")
        cursor.execute("INSERT INTO rcf_lagrange_authors VALUES(5, '944')")
        cursor.execute("INSERT INTO rcf_lagrange_authors VALUES(14, '2901')")
        cursor.execute("INSERT INTO rcf_lagrange_authors VALUES(90, '64')")
    except:
        cnx.rollback()
        raise
    else:
        cnx.commit()


if __name__ == '__main__':
    authors_filepath, docs_filepath = sys.argv[1:3]
    cnx = psycopg2.connect(database='rcf')
    author_infos = parse_author_listing(authors_filepath)
    insert_author_infos(cnx, author_infos)
    infos = parse_doc_listing(docs_filepath, author_infos)
    insert_doc_infos(cnx, infos)
    align_authors(cnx)
