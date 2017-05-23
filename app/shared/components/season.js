import {createElement as ce, Component, PropTypes} from 'react';

import {browserHistory} from 'react-router';
import classNames from 'classnames';

import {Card, CardTitle, CardText, Spinner, IconButton} from 'react-mdl';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';

import Highcharts from 'highcharts';

import {dateFormatter, checkboxFormatter, infoprops} from '..';
import {STYLES} from '../styles';
import {Link, buildURL} from '../urls';

import {mdlclass, numberWithSpaces} from '.';
import {GenreChord} from './chord';
import {SeasonCalendar} from './calendar';


function authorFormatter(author) {
    return ce(Link, {to: `/author/${author.author_id}`,
                     title: `joué ${author.pcount} fois`},
              `${author.author_name} [${author.pcount}]`);
}


export class SeasonList extends Component {

    urlSeasonFormatter(cell, row) {
        let season = row.season
        return ce(Link, {to: `/season/${season}`}, cell)
    }


    render() {
        const seasons = this.props.seasons || [];
        const options = {
            noDataText: 'Téléchargement des données ...',
            sizePerPage: 50,
        };

        return ce(Card, {className: mdlclass({col: 8, tablet: 12}),
                         style: {fontSize: "1em", margin: "auto", marginTop: "10px"}},
                ce(CardText, {style: {margin: "auto",  fontSize: "1em"}},
                  ce(BootstrapTable, {options:options, data: seasons, hover: true, pagination: true},
                    ce(TableHeaderColumn, {dataField:"id",
                                           isKey: true,
                                           hidden: true}, 'ID'),
                    ce(TableHeaderColumn, {dataField:"season",
                                           dataSort: true,
                                           dataFormat: this.urlSeasonFormatter,
                                           width: '15%'},
                       'Saison'),
                    ce(TableHeaderColumn, {dataField:"receipts",
                                           dataSort: true,
                                           dataFormat: numberWithSpaces,
                                           width: '15%'},
                       'Recettes (livres)'),
                    ce(TableHeaderColumn, {dataField:"author1",
                                           dataSort: true,
                                           dataFormat: authorFormatter},
                       'Auteur le plus joué en 1'),
                    ce(TableHeaderColumn, {dataField:"author2",
                                           dataSort: true,
                                           dataFormat: authorFormatter},
                       'Auteur le plus joué en 2')
                  )));
    }
}


SeasonList.propTypes = {
    seasons: PropTypes.array,
};


function seasonPlaysOverview({registers}) {
    function urlPlayFormatter(cell, row) {
        return ce(Link, {to: `/play/${row.play_id}`}, cell)
    }

    function urlAuthorFormatter(cell, row) {
        return ce(Link, {to: `/author/${row.author_id}`}, cell)
    }

    const uniq_plays = {};
    const uniq_season = [];

    registers.forEach(register => {
        for (const play of register.plays) {
            if (uniq_plays[play.play_id]){
                uniq_plays[play.play_id].count++;
                if (play.reprise) {
                    uniq_plays[play.play_id].reprise = true;
                }
                if (play.firstrun) {
                    uniq_plays[play.play_id].firstrun = true;
                }
            }
            else {
                play.count = 1;
                uniq_plays[play.play_id] = play;
            }
        }
    });


    Object.keys(uniq_plays).forEach(k => {
        uniq_season.push(uniq_plays[k]);
    })

    return ce(Card, {className: mdlclass(12), style: {fontSize: "1em"}},
              ce(CardTitle, {style: STYLES.titleChart}, 'Tableau des pièces jouées lors de cette saison'),
              ce(CardText, {style: {margin: "auto",  fontSize: "1em"}, className: mdlclass(8)},
                 ce(BootstrapTable, {data: uniq_season, hover: true, pagination: true, options: {sizePerPage: 25}},
                    ce(TableHeaderColumn, {dataField: "play_id",
                                           isKey: true, hidden: true},
                       'ID'),
                    ce(TableHeaderColumn, {dataField: "play_title",
                                           width: '20',
                                           filter: {
                                               type: 'TextFilter',
                                               placeholder: 'Rechercher une pièce',
                                               delay: 300},
                                           dataSort: true,
                                           dataFormat: urlPlayFormatter},
                       'Pièce'),
                    ce(TableHeaderColumn, {dataField: "play_genre",
                                           width: '10',
                                           dataSort: true}, 'Genre'),
                    ce(TableHeaderColumn, {dataField: "firstrun",
                                           dataSort: true,
                                           width: '10',
                                           dataFormat: checkboxFormatter},
                       'Première'),
                    ce(TableHeaderColumn, {dataField: "reprise",
                                           width: '10',
                                           dataSort: true,
                                           dataFormat: checkboxFormatter}, 'Reprise'),
                    ce(TableHeaderColumn, {dataField: "author_name",
                                           width: '20',
                                           filter: {
                                               type: 'TextFilter',
                                               placeholder: 'Rechercher un auteur',
                                               delay: 300,
                                           },
                                           dataSort: true,
                                           dataFormat: urlAuthorFormatter},
                       'Auteur'),
                    ce(TableHeaderColumn, {dataField: "count",
                                           width: '20',
                                           dataSort: true},
                       'Nombre de représentations')
                   ))
             );
}


function seasonMainCardView({registers, firsts, reprises}) {

    const firstRegister = registers[0],
          lastRegister = registers[registers.length - 1];

    const properties = [
        {label: 'Première date', value: `${firstRegister.weekday} ${dateFormatter(firstRegister.date)}`},
        {label: 'Dernière date', value: `${lastRegister.weekday} ${dateFormatter(lastRegister.date)}`},
    ];

    if (firsts.length) {
        properties.push({label: 'Premières',
                         value: ce('ul', {},
                                   ...firsts.map(play =>
                                                 ce('li', {},
                                                    ce(Link, {to: `/play/${play.play_id}`,
                                                              title: `${play.play_title} - ${play.author_name}`},
                                                       `${play.play_title}, le ${dateFormatter(play.firstRunDate)}`))))});
    }

    if (reprises.length) {
        properties.push({label: 'Reprises',
                         value: ce('ul', {},
                                   ...reprises.map(play =>
                                                   ce('li', {},
                                                      ce(Link, {to: `/play/${play.play_id}`,
                                                                title: `${play.play_title} - ${play.author_name}`},
                                                         `${play.play_title}, le ${dateFormatter(play.repriseDate)}`))))});
    }

    return ce('section', {className: 'section--center mdl-shadow--2dp',
                          style: {justifyContent: "center", marginBottom: "50px"}},
              ce('h2', {style: {textAlign: "center"}}, firstRegister.season),
              ce(Card, {className: mdlclass(12), style: {fontSize: "1em"}},
                 ce(CardText, {style: {margin: "auto",  fontSize: "1em"}},
                    infoprops(properties))),
              ce(Card, {className: mdlclass(12), style: {fontSize: "1em"}},
                 ce(CardText, {style: {margin: "auto",  fontSize: "1em"}},
                    ce(SeasonCalendar, {registers}))
                ),
              ce(seasonPlaysOverview, {registers})
             );
}


/**
 * Identify reference pricing in the season, keep only its first occurence
 * and keep all other pricings.
 **/
function filterPriceTS(tsdata) {
    const pricings = {};

    for (const [_, price] of tsdata) {
        if (pricings[price] === undefined) {
            pricings[price] = 1;
        } else {
            pricings[price]++;
        }
    }
    const sortedPricings = Object.keys(pricings)
          .map(k => [k, pricings[k]])
          .sort((a, b) => b[1] - a[1]);
    const refPrice = Number(sortedPricings[0][0]);
    let filtered = false;
    return tsdata.filter(([_, price]) => {
        if (price === refPrice) {
            if (!filtered) {
                filtered = true;
                return true;
            }
            return false;
        }
        return true;
    });
}


class SeasonOverviewChartView extends Component {

    componentDidMount() {
        const {registers: season, priceSeries} = this.props.seasonData;
        const byDate = {};

        season.forEach(nightdata => {
            byDate[dateFormatter(nightdata.date)] = nightdata;
        });

        const series = [
            {
                name: `Recettes de la saison ${this.props.seasonLabel}`,
                type: 'column',
                yAxis: 0,
                data: season.map(x => [dateFormatter(x.date), x.receipts]),
            },
            ...priceSeries.map(serie => ({name: serie.name,
                                          step: true,
                                          lineWidth: 0,
                                          marker: {
                                              enabled: true,
                                          },
                                          data: filterPriceTS(serie.data).map(([d, p]) => [dateFormatter(d), p]),
                                          yAxis: 1})),
        ];
        return new Highcharts.Chart({
            chart: {
                renderTo: 'seasonchart',
                zoomType: 'xy',
            },
            title: {
                text: ' ',
            },
            subtitle: {
                text: "Le prix de référence des places n'est affiché que la première fois. Ensuite, seuls les variations (double, gratuit, etc.) sont affichées",
                floating: true,
                align: 'right',
                verticalAlign: 'bottom',
                x: -80,
            },
            xAxis: [{
                type: 'category',
            }],
            yAxis: [{
                title: {
                    text: 'Recettes (livres)',
                    style: {
                        color: Highcharts.getOptions().colors[0],
                    },
                },
            }, {
                gridLineWidth: 0,
                title: {
                    text: 'Prix des places (livres)',
                    style: {
                        color: Highcharts.getOptions().colors[1],
                    },
                },
                opposite: true,
            }],
            plotOptions: {
                series: {
                    cursor: 'pointer',
                    point: {
                        events: {
                            click: (evt) => {
                                browserHistory.push(buildURL(`/register/${evt.point.name}`));
                            },
                        },
                    },
                },
            },
            tooltip: {
                shared: true,
                formatter: function() {
                    const date = this.points[0].key;
                    const register = byDate[date]
                    const playTitles = register.plays.map(p => p.play_title).join(' - ');
                    let s = `<span style="font-size: 10px">${register.weekday} ${register.date} - [${playTitles}]</span><br/>`;
                    for(let point of this.points.slice(1)) {
                        s += `<br/><span style="color:${point.series.color}">\u25CF</span>${point.series.name}: ${point.y} livres`;
                    }
                    return s;
                },
            },
            series,
        });
    }

    render() {
        return ce(Card, {className: mdlclass(12)},
                   ce(CardTitle, {style: STYLES.titleChart}, `Recettes de la saison ${this.props.seasonLabel}`),
                   ce(CardText, {style: {margin: "auto"}},
                      ce('div', {id: 'seasonchart'})));
    }
}


SeasonOverviewChartView.propTypes = {
    seasonLabel: PropTypes.string,
    seasonData: PropTypes.object,
};


export class SeasonChordDiagram extends Component {

    constructor(props, context) {
        super(props, context);
        this.state = {chord: null};
    }

    componentDidMount() {
        fetch(buildURL(`/season/chord-${this.props.season}.json`))
            .then(res => res.json())
            .then(chord => this.setState({chord}));
    }

    render() {
        return ce('section', {className: 'section--center mdl-shadow--2dp',
                              style: {justifyContent: "center"}},
                  ce('section', {className: 'section--center', style: {marginBottom: "50px"}},
                     ce(Card, {className: mdlclass(12), style: {fontSize: "1em"}},
                        ce(CardTitle, {style: STYLES.titleChart},
                           `Répartition des genres sur la saison ${this.props.season}`),
                        ce(GenreChord, {chord: this.state.chord})
                        )));
    }
}

SeasonChordDiagram.propTypes = {
    season: PropTypes.string,
};


class SeasonCalendarView extends Component {

    componentDidMount() {

    }

    render({data}) {

    }
}


export class SeasonPrimaryView extends Component {
    render() {
        if (!this.props.loading) {
            let [year1, year2] = this.props.params.id.split('-');
            year1 = Number(year1);
            year2 = Number(year2);
            const titleNavElements = [];
            if (year1 > 1680) {
                titleNavElements.push(ce(Link, {to: `/season/${year1-1}-${year2-1}`,
                                                title: `Saison ${year1-1}-${year2-1}`},
                                         ce(IconButton, {name: "keyboard_arrow_left", colored: true})));
            }
            titleNavElements.push(this.props.params.id);
            if (year2 < 1793) {
                titleNavElements.push(ce(Link, {to: `/season/${year1+1}-${year2+1}`,
                                                title: `Saison ${year1+1}-${year2+1}`},
                                         ce(IconButton, {name: "keyboard_arrow_right", colored: true})));
            }
            return ce('section', null,
                      ce('h2', {style:{textAlign: "center"}}, ...titleNavElements),
                      ce('div', null, ce(seasonMainCardView, this.props.mainentity)),
                      ce('div', null, ce(SeasonOverviewChartView, {
                          seasonData: this.props.mainentity,
                          seasonLabel: this.props.params.id,
                      })),
                      ce(SeasonChordDiagram, {season: this.props.params.id})
            );
        } else {
          return ce(Spinner, {style: {margin: "auto", display: "block"}});
        }
    }
}



SeasonPrimaryView.propTypes = {
    params: PropTypes.object,
    loading: PropTypes.bool,
    mainentity: PropTypes.object,
};


class ASeasonChartView extends Component {

    componentDidMount() {
        const {season} = this.props.seasonData;
        const byDate = {};
        season.forEach(nightdata => {
            // XXX bug if two plays on the same night
            byDate[dateFormatter(nightdata.date)] = nightdata;
        });

        return new Highcharts.Chart({
            chart: {
                renderTo: 'seasonchart',
                type: 'column',
                zoomType: 'x',
            },
            title: {
                text: ' ',
            },
            xAxis: {
                categories: season.map(x => dateFormatter(x.date)),
            },
            yAxis: {
                title: {
                    text: 'Recettes (livres)',
                },
            },
            plotOptions: {
                series: {
                    cursor: 'pointer',
                    point: {
                        events: {
                            click: (evt) => {
                                browserHistory.push(buildURL(`/play/${byDate[evt.point.category].play_id}`));
                            },
                        },
                    },
                },
            },
            series: [{
                name: `Recettes des pièces de ${this.props.seasonData.author.name} sur la saison ${this.props.seasonLabel}`,
                data: season.map(x => x.receipts),
            }],
            tooltip: {
                formatter: function() {
                    const infos = byDate[this.x];
                    return `${infos.weekday} ${infos.date}<br /><b><a href="/play/${infos.play_id}">${infos.play_title}</a> (genre: ${infos.play_genre})`;
                },
            },
        });
    }

    render() {
        return ce(Card, {className: mdlclass(12)},
                  ce(CardTitle, {style: STYLES.titleChart}, `Recettes des pièces de ${this.props.seasonData.author.name} sur la saison ${this.props.seasonLabel}`),
                  ce(CardText, {style: {margin: "auto"}},
                     ce('div', {id: 'seasonchart'})));
    }
}


ASeasonChartView.propTypes = {
    seasonLabel: PropTypes.string,
    seasonData: PropTypes.object,
}


export class ASeasonPrimaryView extends Component {
    render() {
        if (!this.props.loading) {
            const {mainentity} = this.props;
            return ce('section', null,
                      ce('h2', {style:{textAlign: "center"}}, `${mainentity.author.name} - ${this.props.params.season}`),
                      ce('div', {id: 'overview'},
                         ce(ASeasonChartView, {
                             seasonData: mainentity,
                             seasonLabel: this.props.params.season,
                         })
                        )
                     );
        } else {
            return ce(Spinner, {style:{margin: "auto", display: "block"}});
        }
    }
}


ASeasonPrimaryView.propTypes = {
    loading: PropTypes.bool,
    params: PropTypes.object,
    mainentity: PropTypes.object,
}
