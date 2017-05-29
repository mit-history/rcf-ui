import {createElement as ce, Component} from 'react';
import PropTypes from 'prop-types';

import Highcharts from 'highcharts';


export class Pie extends Component {

    componentDidMount() {
        const {
            stats, id: container, colorfunc,
            title, seriename, urlformatter,
        } = this.props;
        const data = stats.map(s => ({
            y: Number(s.count),
            color: colorfunc ? colorfunc(s.label) : null,
            object: s.object,
            name: s.label,
        }));
        new Highcharts.Chart({
            chart: {
                renderTo: container,
                type: 'pie',
            },
            title: {
                text: title,
            },
            yAxis: {
                title: {
                    text: ' ',
                },
            },
            series: [{
                name: seriename,
                data,
            }],
            plotOptions: {
                series: {
                    cursor: 'pointer',
                    point: {
                        events: {
                            click: (evt) => {
                                if (urlformatter) {
                                    urlformatter(evt);
                                }
                            },
                        },
                    },
                },
            },
        });
    }

    render() {
        return ce('div', {id: this.props.id});
    }
}


Pie.propTypes = {
    id: PropTypes.string,
    stats: PropTypes.array,
    title: PropTypes.string,
    seriename: PropTypes.string,
    colorfunc: PropTypes.func,
    urlformatter: PropTypes.func,
};
