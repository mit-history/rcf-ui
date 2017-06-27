import PgFactory from 'pg-promise';
import sregmap from '../shared/sregmap';

export const pgp = PgFactory();

const db = pgp({
    host: process.env.POSTGRES_HOST === undefined
        ? '/var/run/postgresql'
        : process.env.POSTGRES_HOST,
    database: process.env.POSTGRES_DB === undefined
        ? 'rcf_db'
        : process.env.POSTGRES_DB,
    user: process.env.POSTGRES_USER === undefined
        ? 'jbelin'
        : process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD === undefined
        ? 'jbelin'
        : process.env.POSTGRES_PASSWORD,
    ssl: process.env.POSTGRES_SSL === 'require',
    port: process.env.POSTGRES_PORT === undefined
        ? '5432'
        : process.env.POSTGRES_PORT,
});

/****** Home *****/

function nbAuthors() {
    return db
        .query('SELECT COUNT(id) from person_agg')
        .then(results => results[0].count);
}

function nbGenres() {
    return db
        .query(
            'SELECT count(distinct n.normalized) from validated_plays AS p JOIN normalized_genres AS n ON (p.genre=n.genre)',
        )
        .then(results => results[0].count);
}

function nbPlays() {
    return db
        .query(
            "SELECT COUNT(validated_plays.id) FROM validated_plays WHERE validated_plays.title != ''",
        )
        .then(results => results[0].count);
}

function nbSeasons() {
    return db
        .query('SELECT count(distinct season) from registers')
        .then(results => results[0].count);
}

export function fetchHome() {
    const homeData = {};
    const queries = [
        mapPromiseToStore(homeData, nbGenres(), 'nbGenres'),
        mapPromiseToStore(homeData, nbAuthors(), 'nbAuthors'),
        mapPromiseToStore(homeData, nbPlays(), 'nbPlays'),
        mapPromiseToStore(homeData, nbSeasons(), 'nbSeasons'),
    ];

    return Promise.all(queries).then(() => homeData);
}

/****** Genres *****/

export function fetchGenres() {
    return db.query(`
SELECT distinct n.normalized AS genre, count(p.id) AS nb_plays
FROM validated_plays AS p JOIN normalized_genres AS n ON (p.genre=n.genre)
WHERE n.normalized != ''
GROUP BY 1`);
}

export function fetchGenre(id) {
    return db
        .query(
            `
SELECT distinct n.normalized, p.id, p.title,
       SUM(COALESCE(r.total_receipts_recorded_l, 0) * 240 +
           COALESCE(r.total_receipts_recorded_s, 0) * 12 +
           COALESCE(r.total_receipts_recorded_d, 0)) AS receipts,
       COUNT(*) as nb_perfs
FROM validated_plays AS p
     JOIN normalized_genres AS n ON (p.genre=n.genre)
     JOIN register_plays as rp ON (p.id=rp.play_id)
     JOIN registers AS r ON (rp.register_id = r.id)
WHERE p.genre = n.genre AND n.normalized = $1
GROUP BY 1,2,3`,
            [id],
        )
        .then(genre =>
            genre.map(g => ({
                genre_id: g.normalized,
                play_id: g.id,
                title: g.title,
                receipts: Math.round(parseInt(g.receipts / 240)),
                nb_perfs: parseInt(g.nb_perfs),
            })),
        );
}

/****** Authors *****/

export function fetchAuthors() {
    return db.query(
        `SELECT COALESCE(NULLIF(familyname, ''), NULLIF(givenname, ''), name) as name, id, depict_urls from person_agg ORDER BY 1`,
    );
}

function authorReceipts(id) {
    return db
        .query(
            `
SELECT r.season, SUM(COALESCE(r.total_receipts_recorded_l, 0) * 240 +
                     COALESCE(r.total_receipts_recorded_s, 0) * 12 +
                     COALESCE(r.total_receipts_recorded_d, 0)) AS receipts
FROM registers r JOIN register_plays rp ON (r.id=rp.register_id)
                 JOIN authorships pp ON (rp.play_id=pp.play_id)
WHERE pp.ext_id=$1 GROUP BY 1 ORDER BY 1
`,
            [id],
        )
        .then(receipts =>
            receipts.map(r => ({
                year: Number(r.season.split('-')[0]),
                season: r.season,
                receipts: Math.round(Number(r.receipts / 240)),
            })),
        );
}

function authorGenres(id) {
    return db.query(
        `
SELECT n.normalized as genre, COUNT(r.id) as nbplayed
FROM registers as r JOIN register_plays as rp ON (r.id=rp.register_id)
     JOIN validated_plays as p ON (p.id=rp.play_id)
     JOIN authorships as pp ON (pp.play_id=p.id)
     JOIN normalized_genres AS n ON (p.genre=n.genre)
WHERE pp.ext_id=$1 GROUP BY 1 ORDER BY 2 DESC
`,
        [id],
    );
}

function authorCoplayed(id) {
    return db.query(
        `
SELECT p1.author_id, p2.author_id, p2.author_name, COUNT(*)
FROM performances p1 JOIN performances p2 ON (p1.date=p2.date)
WHERE p1.author_id != p2.author_id AND p1.author_id=$1
GROUP BY 1,2,3 ORDER BY 4 DESC
`,
        [id],
    );
}

function authorPlaysOverview(id) {
    return db
        .query(
            `
SELECT p.id, p.title, n.normalized AS genre, min(r.date) AS date_de_premiere,
                         SUM(COALESCE(r.total_receipts_recorded_l, 0)) * 240 +
                         SUM(COALESCE(r.total_receipts_recorded_s, 0)) * 12 +
                         SUM(COALESCE(r.total_receipts_recorded_d, 0)) AS receipts,
                         SUM(CASE WHEN rp.ordering = 1 THEN 1 ELSE 0 END) AS total_1,
                         SUM(CASE WHEN rp.ordering = 2 THEN 1 ELSE 0 END) AS total_2,
                         COUNT(*) as nb_perf
FROM registers as r JOIN register_plays as rp ON (r.id=rp.register_id)
JOIN validated_plays as p ON (p.id=rp.play_id)
JOIN  authorships as pp ON (pp.play_id=p.id) JOIN normalized_genres AS n ON(p.genre=n.genre)
WHERE pp.ext_id=$1 GROUP BY p.title, p.date_de_creation, p.genre, n.normalized, p.id ORDER BY p.title DESC

`,
            [id],
        )
        .then(plays =>
            plays.map(p => ({
                play_id: p.id,
                title: p.title,
                genre: p.genre,
                receipts: Math.round(parseInt(p.receipts / 240)),
                date_de_premiere: p.date_de_premiere,
                nb_perf: parseInt(p.nb_perf),
                total_1: parseInt(p.total_1),
                total_2: parseInt(p.total_2),
            })),
        );
}

function fetchLagrangeImages(id) {
    return Promise.resolve([]);
    //     return db.query(`
    // SELECT DISTINCT ld.url, ld.imgurl, ld.title, ld.title2, ld.subtitle
    // FROM lagrange_doc_authors lda JOIN lagrange_docs ld ON (ld.id=lda.doc_id)
    //      JOIN rcf_lagrange_authors rla ON (rla.lagrange_id=lda.aut_id)
    //      JOIN person_agg pa ON (pa.id=rla.person_id)
    // WHERE pa.id=$1 AND ld.imgurl != '';
    // `, [id]);
}

function mapPromiseToStore(store, promise, property) {
    return promise.then(result => {
        store[property] = result;
        return store;
    });
}

function fetchAuthorInfos(id) {
    return db
        .query('SELECT * FROM person_agg where id=$1', [id])
        .then(records => records[0]);
}

export function fetchAuthor(id) {
    return fetchAuthorInfos(id).then(authorData => {
        const queries = [
            mapPromiseToStore(authorData, authorReceipts(id), 'receipts'),
            mapPromiseToStore(authorData, authorGenres(id), 'genres'),
            mapPromiseToStore(authorData, authorCoplayed(id), 'coplayed'),
            mapPromiseToStore(
                authorData,
                authorPlaysOverview(id),
                'playsOverview',
            ),
            mapPromiseToStore(
                authorData,
                fetchLagrangeImages(id),
                'lagrangeImages',
            ),
        ];
        return Promise.all(queries).then(() => authorData);
    });
}

export function fetchAuthorSerieDef(id) {
    return Promise.all([
        fetchAuthorInfos(id),
        authorReceipts(id),
    ]).then(([infos, receipts]) => {
        return {
            name: infos.name,
            data: receipts.map(r => [r.season, r.receipts]),
        };
    });
}

/****** Plays *****/

function playPerformance(id) {
    return db
        .query(
            `
SELECT r.season, count(*) AS nb_perfs
FROM registers r JOIN register_plays rp ON (r.id=rp.register_id)
                 JOIN authorships pp ON (rp.play_id=pp.play_id)
WHERE rp.play_id=$1 GROUP BY 1 ORDER BY 1
`,
            [id],
        )
        .then(nb_perfs =>
            nb_perfs.map(p => ({
                year: Number(p.season.split('-')[0]),
                season: p.season,
                nb_perfs: Number(p.nb_perfs),
            })),
        );
}

function playExternalResources(id) {
    return db.query(
        `
SELECT ex.source, ex.url
FROM validated_plays AS p
  JOIN external_resource AS ex ON (p.id=ex.play_id)
WHERE p.id=$1
`,
        [id],
    );
}

export function fetchPlay(id) {
    return db
        .query(
            `
SELECT p.id, p.acts, n.normalized as genre, pa.name AS author,
       pa.id as author_id, p.prose_vers, p.prologue, p.title,
       p.musique_danse_machine
FROM validated_plays AS p
  JOIN register_plays AS rp ON (p.id=rp.play_id)
  JOIN authorships AS pp ON (pp.play_id=p.id)
  JOIN person_agg AS pa ON (pp.ext_id=pa.id)
  JOIN normalized_genres AS n ON (p.genre=n.genre)
WHERE p.id=$1
`,
            [id],
        )
        .then(records => records[0])
        .then(playData => {
            const queries = [
                mapPromiseToStore(playData, playPerformance(id), 'nb_perfs'),
                mapPromiseToStore(
                    playData,
                    playExternalResources(id),
                    'ext_resources',
                ),
            ];
            return Promise.all(queries).then(() => playData);
        });
}

export function fetchPlays() {
    return db
        .query(
            `
SELECT p.id play_id, p.title play_title, n.normalized as genre,
       pa.id author_id, pa.name author_name,
       SUM(CAST (rp.reprise AS integer)) nbreprises,
       COUNT(rp) nbperfs,
       MIN(r.date) firstdate
FROM registers r JOIN register_plays rp ON (r.id=rp.register_id)
     JOIN validated_plays p ON (rp.play_id=p.id)
     JOIN authorships pp ON (p.id=pp.play_id)
     JOIN person_agg pa ON (pp.ext_id=pa.id)
     JOIN normalized_genres n ON (p.genre=n.genre)
GROUP BY p.id, p.title, n.normalized, pa.id, pa.name
ORDER BY nbperfs DESC, p.title;
`,
        )
        .then(rows =>
            rows.map(row => ({
                id: row.play_id,
                title: row.play_title,
                genre: row.genre,
                author_id: row.author_id,
                author_name: row.author_name,
                nbreprises: Number(row.nbreprises),
                nbperfs: Number(row.nbperfs),
                firstdate: row.firstdate,
            })),
        );
}

export function fetchReprises(playId) {
    return db
        .query(
            `
SELECT r.season, r.date,
       SUM(COALESCE(r.total_receipts_recorded_l, 0) * 240 +
           COALESCE(r.total_receipts_recorded_s, 0) * 12 +
           COALESCE(r.total_receipts_recorded_d, 0)) AS receipts
FROM registers r JOIN register_plays rp ON (r.id=rp.register_id)
                 JOIN authorships pp ON (rp.play_id=pp.play_id)
WHERE rp.play_id=$1 AND rp.reprise = TRUE
GROUP BY r.season, r.date
ORDER BY r.date
`,
            [playId],
        )
        .then(perfs =>
            perfs.map(p => ({
                season: p.season,
                date: p.date,
                receipts: Math.floor(p.receipts / 240),
            })),
        );
}

/****** Seasons *****/

function seasonInfos() {
    return db
        .query(
            `
SELECT r.season,
        SUM(COALESCE(r.total_receipts_recorded_l, 0)) * 240 +
        SUM(COALESCE(r.total_receipts_recorded_s, 0)) * 12 AS receipts
FROM registers AS r
GROUP BY r.season ORDER BY r.season
`,
        )
        .then(plays =>
            plays.map(s => ({
                season: s.season,
                receipts: Math.round(Number(s.receipts / 240)),
            })),
        );
}

function seasonMostPlayed(ordering) {
    return db.query(
        `
SELECT *
FROM
    (SELECT pa.id author_id, pa.name author_name, r.season , COUNT(r.id) pcount,
            row_number() OVER (PARTITION BY r.season ORDER BY COUNT(r.id) DESC) rank
     FROM registers r JOIN register_plays as rp ON r.id=rp.register_id
          JOIN validated_plays as p ON p.id=rp.play_id
          JOIN authorships AS pp ON (pp.play_id=p.id)
          JOIN person_agg AS pa ON (pp.ext_id=pa.id)
     WHERE rp.ordering=$1
     GROUP BY pa.id, pa.name, r.season ORDER BY r.season) as T
WHERE T.rank=1
ORDER BY season;
`,
        [ordering],
    );
}

export function fetchSeasons() {
    return Promise.all([
        seasonInfos(),
        seasonMostPlayed(1),
        seasonMostPlayed(2),
    ]).then(([infos, played1, played2]) => {
        for (let i = 0; i < infos.length; i++) {
            infos[i].author1 = played1[i];
            infos[i].author2 = played2[i];
        }
        return infos;
    });
}

function seasonPriceSeries(season) {
    return db
        .query(
            `
SELECT r.id register_id, r.date, sc.id sc_id, sc.name sc_name,
       ts.price_per_ticket_l + ts.price_per_ticket_s / 20. + ts.price_per_ticket_l / 240. as price
FROM registers r
     JOIN ticket_sales ts ON (ts.register_id=r.id)
     JOIN seating_categories sc ON (ts.seating_category_id=sc.id)
WHERE r.season=$1 AND NOT sc.name ILIKE '%irr%' AND NOT sc.name ILIKE '%billet%'
ORDER BY r.date, price`,
            [season],
        )
        .then(rows => {
            const series = [];
            const seriesById = {};
            rows.forEach(record => {
                let serie;
                if (seriesById.hasOwnProperty(record.sc_id)) {
                    serie = seriesById[record.sc_id];
                } else {
                    serie = {
                        name: record.sc_name,
                        data: [],
                    };
                    seriesById[record.sc_id] = serie;
                    series.push(serie);
                }
                serie.data.push([record.date, Math.round(record.price)]);
            });
            return series;
        });
}

function seasonInfo(season) {
    return db
        .query(
            `
SELECT r.date, r.weekday, p.author, p.title, n.normalized as genre,
       p.id AS play_id, pa.id AS author_id, pa.name AS author_name,
       rp.reprise, rp.firstrun,
       COALESCE(r.total_receipts_recorded_l, 0) * 240 +
       COALESCE(r.total_receipts_recorded_s, 0) * 12 AS receipts
FROM registers as r
     JOIN register_plays as rp ON r.id=rp.register_id
     JOIN validated_plays as p ON p.id=rp.play_id
     JOIN authorships AS pp ON (pp.play_id=p.id)
     JOIN person_agg AS pa ON (pp.ext_id=pa.id)
     JOIN normalized_genres AS n ON (p.genre=n.genre)
WHERE r.season=$1
ORDER BY r.date`,
            [season],
        )
        .then(season => {
            const dates = [];
            const firsts = [],
                reprises = [];
            const fprocessed = new Set(),
                rprocessed = new Set();

            let lastDate;
            season.forEach(s => {
                const play = {
                    play_genre: s.genre,
                    play_title: s.title,
                    play_id: s.play_id,
                    author_id: s.author_id,
                    author_name: s.author_name,
                    reprise: s.reprise,
                    firstrun: s.firstrun,
                };
                if (s.firstrun && !fprocessed.has(s.play_id)) {
                    firsts.push(Object.assign({ firstRunDate: s.date }, play));
                    fprocessed.add(s.play_id);
                }
                if (s.reprise && !rprocessed.has(s.play_id)) {
                    reprises.push(Object.assign({ repriseDate: s.date }, play));
                    rprocessed.add(s.play_id);
                }
                if (!lastDate || lastDate.date.getTime() !== s.date.getTime()) {
                    lastDate = {
                        author: s.author,
                        plays: [play],
                        receipts: Math.round(Number(s.receipts / 240)),
                        date: s.date,
                        weekday: s.weekday,
                    };
                    dates.push(lastDate);
                } else {
                    lastDate.plays.push(play);
                }
            });
            return { dates, reprises, firsts };
        });
}

export function fetchSeason(id) {
    return Promise.all([
        seasonInfo(id),
        seasonPriceSeries(id),
    ]).then(([{ dates: registers, reprises, firsts }, priceSeries]) => ({
        registers,
        reprises,
        firsts,
        priceSeries,
    }));
}

export function fetchSeasonGenreChord(season) {
    return db
        .query(
            `
SELECT r.date, ng.normalized genre, rp.ordering
FROM registers r
     JOIN register_plays rp ON (r.id=rp.register_id)
     JOIN validated_plays p ON (rp.play_id=p.id)
     JOIN normalized_genres ng ON (p.genre=ng.genre)
WHERE r.season=$1
ORDER BY r.date, rp.ordering
`,
            [season],
        )
        .then(results => {
            const genres = [...new Set(results.map(r => r.genre))].sort(
                (a, b) => (a && b ? a.localeCompare(b) : -1),
            );
            const names = [...genres, '', ...genres, ''];
            const genreIdx = {};
            genres.forEach((g, i) => {
                genreIdx[g] = i;
            });
            const matrix = [];
            names.forEach(() => {
                matrix.push(new Array(names.length).fill(0));
            });
            const byDate = {};
            for (const { date, genre, ordering } of results) {
                if (ordering && ordering >= 1 && ordering <= 5) {
                    if (byDate[date] === undefined) {
                        byDate[date] = [genre];
                    } else {
                        byDate[date].push(genre);
                    }
                }
            }
            let total = 0;
            for (const date of Object.keys(byDate)) {
                const nightGenres = byDate[date];
                // ignore nights with less or more than two plays
                if (nightGenres.length !== 2) {
                    continue;
                }
                const [genre1, genre2] = nightGenres;
                matrix[genreIdx[genre2]][
                    genreIdx[genre1] + genres.length + 1
                ]++;
                matrix[genreIdx[genre1] + genres.length + 1][
                    genreIdx[genre2]
                ]++;
                total++;
            }
            const emptyPerc = 0.25;
            const emptyStroke = Math.round(total * emptyPerc);
            let lastrow = matrix[genres.length];
            lastrow[lastrow.length - 1] = emptyStroke;
            lastrow = matrix[matrix.length - 1];
            lastrow[genres.length] = emptyStroke;
            return { names, matrix, total, emptyPerc, emptyStroke };
        });
}

function authorSeasonInfos(author, season) {
    return db.query(
        `
SELECT r.date, r.weekday, r.total_receipts_recorded_l receipts,
       p.id play_id, p.title play_title, n.normalized play_genre
FROM registers as r
     JOIN register_plays as rp ON r.id=rp.register_id
     JOIN validated_plays as p ON p.id=rp.play_id
     JOIN authorships AS pp ON (pp.play_id=p.id)
     JOIN normalized_genres AS n ON (p.genre=n.genre)
WHERE pp.ext_id=$1 AND r.season=$2
ORDER BY r.date`,
        [author, season],
    );
}

export function fetchASeason(author, season) {
    const data = {};
    const queries = [
        mapPromiseToStore(data, fetchAuthorInfos(author), 'author'),
        mapPromiseToStore(data, authorSeasonInfos(author, season), 'season'),
    ];
    return Promise.all(queries).then(() => data);
}

/****** Register *****/
function prevnextDate(date) {
    return db
        .query(
            `
SELECT prev, next FROM (
  SELECT lag(r.date) OVER (ORDER BY r.date) AS prev,
         r.date,
         lead(r.date) OVER (ORDER BY r.date) AS next
  FROM registers r JOIN registers r2 ON (r.season=r2.season)
  WHERE r2.date=$1) AS t
WHERE t.date=$1`,
            [date],
        )
        .then(rows => ({ prevdate: rows[0].prev, nextdate: rows[0].next }));
}

function registerInfos(date) {
    return db
        .query(
            `
SELECT r.date, r.weekday, r.total_receipts_recorded_l receipts,
       r.payment_notes, r.misc_notes, r.for_editor_notes,
       rp.ex_attendance, rp.ex_representation, rp.ex_place,
       rp.ordering, rp.debut, rp.reprise,
       p.id play_id, p.title play_title, n.normalized play_genre,
       pa.id author_id, pa.name author_name
FROM registers as r
     JOIN register_plays as rp ON r.id=rp.register_id
     JOIN validated_plays as p ON p.id=rp.play_id
     JOIN authorships AS pp ON (pp.play_id=p.id)
     JOIN person_agg AS pa ON (pp.ext_id=pa.id)
     JOIN normalized_genres AS n ON (p.genre=n.genre)
WHERE r.date=$1
ORDER BY rp.ordering`,
            [date],
        )
        .then(rows => {
            const infos = {
                date: rows[0].date,
                weekday: rows[0].weekday,
                receipts: rows[0].receipts,
                payment_notes: rows[0].payment_notes,
                misc_notes: rows[0].misc_notes,
                editor_notes: rows[0].for_editor_notes,
                ex_attendance: rows[0].ex_attendance,
                ex_representation: rows[0].ex_representation,
                ex_place: rows[0].ex_place,
                plays: rows.map(row => ({
                    id: row.play_id,
                    title: row.play_title,
                    genre: row.play_genre,
                    author_id: row.author_id,
                    author_name: row.author_name,
                    reprise: row.reprise,
                    ordering: row.ordering,
                })),
            };
            return infos;
        });
}

function registerImage(date) {
    return db
        .query(
            `
SELECT r.date, r.season, ri.id, ri.filepath, ri.image_file_name
FROM registers as r
    JOIN register_images ri ON (r.id=ri.register_id)
        WHERE date=$1
        AND ri.filepath is not null
        ORDER BY ri.id`,
            [date],
        )
        .then(results => {
            const imageList = [];

            results.forEach(result => {
                let baseUrl = sregmap[result.season].base_url;
                let filepath = result.filepath.replace(
                    /(.*?)[rv]?\.jpg/,
                    '$1.jpg',
                );
                if (sregmap[result.season].pad1) {
                    filepath = filepath.replace(/M119/g, 'M1119');
                }

                const imgInfo = {};
                imgInfo.url = baseUrl + filepath;
                imgInfo.rnum = sregmap[result.season].r_num;
                imageList.push(imgInfo);
            });
            return imageList;
        });
}

export function fetchRegister(date) {
    return Promise.all([
        registerInfos(date),
        prevnextDate(date),
        registerImage(date),
    ]).then(([infos, prevnext, imageList]) =>
        Object.assign(infos, prevnext, { imageList }),
    );
}

/****** Search *****/

function searchAuthors(term) {
    return db.query(
        `
SELECT DISTINCT p.id, p.name "label"
FROM person_agg p
WHERE p.name ILIKE $1
`,
        [`%${term}%`],
    );
}

function searchPlays(term) {
    return db.query(
        `
SELECT DISTINCT p.id, p.title "label"
FROM validated_plays p
WHERE p.title ILIKE $1
`,
        [`%${term}%`],
    );
}

export function ftisearch(term) {
    return Promise.all([
        searchAuthors(term),
        searchPlays(term),
    ]).then(([authors, plays]) => {
        return [
            ...authors.map(a => ({ type: 'author', id: a.id, label: a.label })),
            ...plays.map(p => ({ type: 'play', id: p.id, label: p.label })),
        ];
    });
}

export default db;
