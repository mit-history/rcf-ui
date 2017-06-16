/* global d3 */
import { createElement as ce, Component } from 'react';
import PropTypes from 'prop-types';

import { browserHistory } from 'react-router';

import { dateFormatter } from '..';
import { buildURL } from '../urls';

function firstDayOfNextMonth(date) {
    const nextMonth = (date.getMonth() + 1) % 12,
        year = nextMonth === 0 ? date.getFullYear() + 1 : date.getFullYear();
    return new Date(year, nextMonth, 1, 12);
}

function weekdayIndex(date) {
    return (date.getDay() + 6) % 7; // 0 is Sunday
}

function daysBetween(d1, d2) {
    return Math.floor((Number(d1) - Number(d2)) / 86400000);
}

function buildCalendar(data, domselector) {
    const firstDate = new Date(data[0].date),
        lastDate = new Date(data[data.length - 1].date);

    const registersByDay = {};
    data.forEach(d => {
        registersByDay[dateFormatter(new Date(d.date))] = d;
    });

    const weekdays = [
        'lundi',
        'mardi',
        'mercredi',
        'jeudi',
        'vendredi',
        'samedi',
        'dimanche',
    ],
        monthnames = [
            'janvier',
            'février',
            'mars',
            'avril',
            'mai',
            'juin',
            'juillet',
            'août',
            'septembre',
            'octobre',
            'novembre',
            'décembre',
        ];

    const firstDay = new Date(firstDate.getFullYear(), firstDate.getMonth(), 1),
        lastDay = firstDayOfNextMonth(lastDate);

    const plottedData = d3.time.days(firstDay, lastDay).map(date => {
        date = new Date(date);
        const dayData = {
            date,
            weekday: weekdayIndex(date),
        };
        if (date < firstDate || date > lastDate) {
            dayData.receipts = 0;
            dayData.inrange = false;
        } else {
            dayData.register = registersByDay[dateFormatter(date)];
            dayData.receipts = dayData.register ? dayData.register.receipts : 0;
            dayData.inrange = true;
        }
        return dayData;
    });
    const minReceipts = Math.min(...data.map(d => d.receipts)),
        maxReceipts = Math.max(...data.map(d => d.receipts));

    const cellsize = 20,
        lefttextSize = 100,
        textmargin = 10,
        hmargin = 20,
        vmargin = 30,
        leftmargin = hmargin + lefttextSize + textmargin,
        fontsize = 20,
        nbrows = 7,
        nbcols = Math.floor(plottedData.length / 7) + 2,
        width = nbcols * cellsize + lefttextSize + textmargin + hmargin * 2,
        height = nbrows * cellsize + vmargin * 2;

    const color = d3.scale
        .linear()
        .domain([minReceipts, maxReceipts])
        .interpolate(d3.interpolateHcl)
        .range([d3.rgb('#FFF3BB'), d3.rgb('#8e0000')]);

    const svg = d3
        .select(domselector)
        .selectAll('svg')
        .data(d3.range(firstDate.getFullYear(), firstDate.getFullYear() + 1))
        .enter()
        .append('svg')
        .attr('width', width)
        .attr('height', height);

    let tooltip = document.querySelector('#scalendar-tooltip');

    if (tooltip === null) {
        tooltip = d3
            .select('body')
            .append('div')
            .attr('id', 'scalendar-tooltip')
            .style('position', 'absolute')
            .style('z-index', '10')
            .style('border', '1px solid black')
            .style('background-color', '#fff')
            .style('visibility', 'hidden');
    } else {
        tooltip = d3.select(tooltip);
    }
    svg
        .selectAll('.calendar-daylabel')
        .data(weekdays)
        .enter()
        .append('text')
        .text(d => d)
        .attr('x', hmargin + lefttextSize)
        .attr('y', (d, i) => fontsize + vmargin + i * cellsize)
        .attr('class', 'calendar-daylabel')
        .style('text-anchor', 'end');

    svg
        .selectAll('.calendar-monthlabel')
        .data(d3.time.months(firstDate, lastDate, 3))
        .enter()
        .append('text')
        .text(d => monthnames[d.getMonth()])
        .attr(
            'x',
            d =>
                leftmargin +
                cellsize * Math.floor(daysBetween(d, firstDay) / 7),
        )
        .attr('y', vmargin - fontsize / 2)
        .attr('class', 'calendar-monthlabel');

    const grect = svg.append('g');

    function dayclass(nightinfos) {
        const classes = ['calendar-day'];
        if (!nightinfos.inrange) {
            classes.push('calendar-empty-cell');
        }
        if (nightinfos.free) {
            classes.push('calendar-free');
        } else if (nightinfos.highrate) {
            classes.push('calendar-highrate');
        }
        return classes.join(' ');
    }

    const rect = grect
        .selectAll('.calendar-day')
        .data(plottedData)
        .enter()
        .append('rect')
        .attr('class', dayclass)
        .attr('width', cellsize)
        .attr('height', cellsize)
        .style(
            'fill',
            d =>
                d.free || !d.inrange || !d.register
                    ? '#fff'
                    : color(d.receipts),
        )
        .attr('x', (d, i) => leftmargin + cellsize * Math.floor(i / 7))
        .attr('y', (d, i) => vmargin + cellsize * (i % 7))
        .on('mouseover', mouseover)
        .on('mouseout', mouseout)
        .on('click', d => {
            hideTooltip();
            browserHistory.push(buildURL(`/register/${dateFormatter(d.date)}`));
        });

    function mouseover({ register }) {
        if (!register) {
            return;
        }
        d3
            .select(this)
            .style('cursor', 'pointer')
            .style('stroke-width', '2')
            .style('stroke-opacity', '0.8')
            .style('stroke', 'black');
        tooltip.style('visibility', 'visible');
        const formattedPlays = register.plays.map(
            p => `<li>${p.play_title} / ${p.author_name}</li>`,
        );
        const content = `
${dateFormatter(register.date)}<br/>
Recettes: ${register.receipts} livres
<ul>
${formattedPlays}
</ul>
`;
        tooltip.transition().duration(200).style('opacity', 0.9);
        tooltip
            .html(content)
            .style('left', d3.event.pageX + 30 + 'px')
            .style('top', d3.event.pageY + 'px');
    }

    function mouseout({ register }) {
        if (!register) {
            return;
        }
        d3.select(this).style('cursor', 'default').style('stroke-width', '0');
        hideTooltip();
    }

    function hideTooltip() {
        tooltip.transition().duration(500).style('opacity', 0);
        while (tooltip.firstChild) {
            tooltip.removeChild(tooltip.firstChild);
        }
    }
}

export class SeasonCalendar extends Component {
    render() {
        return ce(
            'div',
            { style: { width: '80%', margin: '0 auto', textAlign: 'center' } },
            ce('h2', null, 'Calendrier et recettes de la saison'),
            ce('div', {
                id: 'scalendar',
                key: 'd' + Math.round(Math.random() * 10000), // XXX
                ref: () => buildCalendar(this.props.registers, '#scalendar'),
            }),
        );
    }
}

SeasonCalendar.propTypes = {
    registers: PropTypes.array,
};
