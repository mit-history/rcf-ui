import {createElement as ce, Component, PropTypes} from 'react';

import {browserHistory} from 'react-router';
import classNames from 'classnames';

import {Card, CardTitle, CardText, Spinner} from 'react-mdl';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';

import {Lazy} from 'react-lazy';

import {dateFormatter, infoprops} from '..';
import {STYLES, genreColor} from '../styles';
import {Link, buildURL} from '../urls';
import {mdlclass, numberWithSpaces} from '.';
import {HighchartsComparator} from './comparator';
import {Pie} from './pie';


export class AuthorList extends Component {

    render() {
        const authors = this.props.authors || [];
        return ce('div', {className: 'mdl-grid'},
                  authors.map(author =>
                              ce('div', {className: mdlclass(3),
                                         key: author.id,
                                         style: {marginTop: "15px"}},
                                 ce(Link, {to: `/author/${author.id}`, style: {textDecoration: "none", display:"inline-block"}},
                                    ce(Card, {shadow: 2, style: {background: "#fff"}},
                                       ce(CardTitle, {expand: true,
                                                      style: {
                                                          background: author.depict_urls[0]
                                                              ? `url("${author.depict_urls[0]}") no-repeat center top`
                                                              : `url(${buildURL('/images/default-picto-author.png')}) no-repeat center top`,
                                                          minHeight: '250px',
                                                          borderTop: "3px solid #009688",
                                                      },
                                                     }),
                                       ce(CardText, {style: {background: "#009688", width: "100%", padding: 0}},
                                          ce('h2', {
                                              style: {
                                                  padding: "5px 10px 5px 10px",
                                                  margin: "5px",
                                                  lineHeight: "35px",
                                                  fontSize: "20px",
                                                  textAlign: "center",
                                                  color: "#fff",
                                              },
                                          }, author.name)
                                         )
                                      )
                                   )
                                )
                             )
                 );
    }
}


AuthorList.propTypes = {
    authors: PropTypes.array,
};


function authorPlaysOverview({authorData}){

    function urlFormatter(cell, row) {
        return ce(Link, {to: `/play/${row.play_id}`}, cell )
    }

    return ce(Card, {className: mdlclass({col: 9, tablet: 12})},
              ce(CardTitle, {style: STYLES.titleChart}, 'pièces'),
              ce(CardText, {style: {margin: "0 auto", fontSize: "1em"}},
                 ce(BootstrapTable, {data: authorData.playsOverview, hover: true},
                    ce(TableHeaderColumn, {dataField: "title",
                                           isKey: true,
                                           dataSort: true,
                                           dataFormat: urlFormatter},
                       'Titre'),
                    ce(TableHeaderColumn, {dataField: "receipts",
                                           dataSort: true,
                                           dataFormat: numberWithSpaces},
                       'Recettes (livres)'),
                    ce(TableHeaderColumn, {dataField: "nb_perf",
                                           dataSort: true,
                                           width: '140px'},
                       'Représentations'),
                    ce(TableHeaderColumn, {dataField: "date_de_premiere",
                                           dataSort: true,
                                           dataFormat: dateFormatter},
                       'Date de la Première'),
                    ce(TableHeaderColumn, {dataField: "total_1",
                                           dataSort: true,
                                           width: '120px'}, 'Jouée en 1'),
                    ce(TableHeaderColumn, {dataField: "total_2",
                                           dataSort: true,
                                           width: '120px'}, 'Jouée en 2'),
                    ce(TableHeaderColumn, {dataField: "genre",
                                           dataSort: true}, 'Genre')
                   )
                )
             );
}


function authorGenreStatView({authorData}){
  const pieData = authorData.genres.map(g => ({label: g.genre,
                                               count: g.nbplayed,
                                               object: g}));

  return ce(Card, {className: mdlclass({col: 3, tablet: 12})},
            ce(CardTitle, {style: STYLES.titleChart}, 'statistiques'),
            ce(CardText, null,
               ce(Pie, {stats: pieData,
                        id: 'piegenre',
                        title: 'Répartition des pièces jouées par genre',
                        seriename: 'Nombre de représentations',
                        colorfunc: genreColor,
                        urlformatter: (evt) => browserHistory.push(buildURL(`/genre/${evt.point.object.genre}`)),
                       })),
            coplayedCardView({authorData})
           );
}


function authorMainCardView({authorData}) {
    let totalReceipt = 0;
    let nbPerf = 0;
    authorData.receipts.map( r => (totalReceipt += r.receipts))
    authorData.playsOverview.map( p => (nbPerf += p.nb_perf))

    const properties = [
        {valueClass: 'scopenote', value: authorData.bnf_notes},
        {label: 'Pièces', value: authorData.playsOverview.length},
        {label: 'Représentations', value: nbPerf},
        {label: 'Recettes', value: `${numberWithSpaces(totalReceipt)} livres`},
    ];

    if (authorData.ext_uris && authorData.ext_uris[0]) {
        properties.push({value: ce('a',
                                   {href:authorData.ext_uris[0], style:{color:"#757575"}},
                                   'Voir cet auteur sur data.bnf.fr')});
    }

    return ce('section', {className: 'section--center mdl-grid',
                          style: {justifyContent: "center"}},
              ce(Card, {className: mdlclass({col: 3, tablet: 6})},
                 ce('img', {src: authorData.depict_urls[0] || buildURL('/images/default-picto-author.png'),
                            style: {maxHeight: "200px", margin: "auto"},
                           }),
                 ce('p', {style: {textAlign: "center"}}, `${authorData.birthdate || '?'} - ${authorData.deathdate || '?'}`)),
              ce(Card, {className: mdlclass({col: 3, tablet: 6, phone: 4})},
                 ce(CardTitle, null, authorData.name),
                 infoprops(properties)));
}


function authorGalleryView({authorData}) {
    const hasImages = ((authorData.depict_urls.length &&
                        authorData.depict_urls[0]) ||
                       authorData.lagrangeImages.length);
    if(!hasImages) {
        return ce('div');
    }
    const imageObjects = authorData.lagrangeImages.map(image => ({
        imgurl: image.imgurl,
        targeturl: image.url,
        imgtitle: `${image.title} (${image.subtitle})`,
    }));

    authorData.depict_urls.forEach(image => {
        const imgurl = image;
        let imgtitle, targeturl;
        if (imgurl.indexOf('wiki') !== -1) {
            imgtitle = 'Illustration provenant de wikimedia';
            targeturl = imgurl;
        } else if (imgurl.indexOf('ark:/') !== -1) {
            imgtitle = 'Illustration provenant de Gallica';
            targeturl = imgurl.slice(0, -10);  // remove ".thumbnail" extension
        }
        imageObjects.push({
            imgurl,
            imgtitle,
            targeturl,
        });
    });

    return ce(Card, {className: classNames('mdl-shadow--2dp', mdlclass(12))},
              ce(CardTitle, {style: STYLES.titleChart}, 'Images'),
              ce(CardText, {className: 'mdl-grid', style: {margin: "auto"}},
                 ...imageObjects.map(image => ce(
                     'div', {className: mdlclass({col:2, tablet: 4, phone: 2}),
                             style: {justifyContent: "center", padding: "5px"}},
                     ce(Lazy, {nodeName: 'a', href: image.targeturl, title: image.imgtitle,
                               className: 'image-link image-link--200px'},
                        ce('img', {alt: image.imgtitle,
                                   src: image.imgurl,
                                   style: {maxHeight: "200px", maxWidth: "200px"}})))))
             );
}


function coplayedCardView({authorData}) {
    const pieData = authorData.coplayed
          .map(c => ({label: c.author_name, count: c.count, object: c}))
          .sort((a, b) => b.count - a.count)
          .slice(0, 10);
    return ce(Pie, {stats: pieData,
                    id: 'coplayedpie',
                    title: 'Les 10 auteurs les plus joués la même soirée',
                    seriename: 'auteurs',
                    urlformatter: (evt) => browserHistory.push(buildURL(`/author/${evt.point.object.author_id}`)),
                   });
}


class SeasonCardView extends Component {

    render() {
        return ce(HighchartsComparator, {
            urlformatter: (evt) => buildURL(`/aseason/${this.props.authorData.id}/${evt.point.name}`),
            seriedef: {name: this.props.authorData.name,
                       data: this.props.authorData.receipts},
            plotTitle: 'saisons théâtrales',
        });
    }
}


SeasonCardView.propTypes = {
    authorData: PropTypes.object,
};


export class AuthorPrimaryView extends Component {

    render() {
        if (!this.props.loading) {
            return ce('div', {id: 'overview'},
                      ce(authorMainCardView, {authorData: this.props.mainentity}),
                      ce('section', {className: "section--center mdl-grid"},
                         ce(authorGenreStatView, {authorData: this.props.mainentity}),
                         ce(authorPlaysOverview, {authorData: this.props.mainentity})
                        ),
                      ce('section', {className: "section--center"},
                         ce(SeasonCardView, {authorData: this.props.mainentity})
                        ),
                      ce(authorGalleryView, {authorData: this.props.mainentity})
                     );
        } else {
            return ce(Spinner, {style:{margin: "auto", display: "block"}});
        }
    }
}

AuthorPrimaryView.propTypes = {
    loading: PropTypes.bool,
    mainentity: PropTypes.object,
};
