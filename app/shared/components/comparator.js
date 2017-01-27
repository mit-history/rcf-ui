import {createElement as ce, Component, PropTypes} from 'react';
import {browserHistory} from 'react-router';

import {Card, CardTitle, CardText} from 'react-mdl';

import Highcharts from 'highcharts';

import {mdlclass} from '.';
import {STYLES} from '../styles';
import {buildURL} from '../urls';

import AutoComplete, {authorsearch} from './autocomplete';


export class HighchartsComparator extends Component {

    constructor(props) {
        super(props);
        this.chart = null;
        this.addSerie = this.addSerie.bind(this);
    }

    addSerie(item) {
        fetch(buildURL(`/author/seriedef-${item.id}.json`))
            .then(res => res.json())
            .then(seriedef => this.chart.addSeries(seriedef));
    }

    componentDidMount() {
        const {urlformatter, seriedef} = this.props;
        this.chart = new Highcharts.Chart({
            chart: {
                renderTo: 'seasonchart',
                type: 'column',
                zoomType: 'x',
            },
            title: {
                text: ' ',
            },
            xAxis: {
                type: 'category',
                labels: {
                    rotation: -45,
                },
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
                                browserHistory.push(urlformatter(evt));
                            },
                        },
                    },
                },
            },
            series: [{
                name: seriedef.name,
                data: seriedef.data.map(x => [x.season, x.receipts]),
            }],
        });
    }

    render() {
        return ce(Card, {className: mdlclass(12)},
                  ce(CardTitle, {style: STYLES.titleChart}, this.props.plotTitle),
                  ce('div', {id: 'comparator-autocomplete',
                             className: 'mdl-cell mdl-cell--4-col mdl-cell--8-offset'},
                     ce(AutoComplete, {
                         title: 'Entrez un auteur pour comparer les recettes',
                         onItemClick: this.addSerie,
                         onItemSelect: this.addSerie,
                         itemfetcher: authorsearch,
                     })),
                  ce(CardText, {style: {margin: "auto"}},
                     ce('div', {id: 'seasonchart'})));
    }

}


HighchartsComparator.propTypes = {
    urlformatter: PropTypes.func,
    seriedef: PropTypes.object,
    plotTitle: PropTypes.string,
};
