import { createElement as ce, Component } from 'react';
import PropTypes from 'prop-types';

import { Card, CardTitle, CardText, Spinner } from 'react-mdl';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import Highcharts from 'highcharts';

import { mdlclass } from '.';
import { dateFormatter } from '..';
import { Link } from '../urls';
import { STYLES } from '../styles';

function urlPlayFormatter(cell, row) {
    return ce(Link, { to: `/play/${row.id}` }, cell);
}

function urlAuthorFormatter(cell, row) {
    return ce(Link, { to: `/author/${row.author_id}` }, cell);
}

function urlRepriseFormatter(cell, row) {
    if (cell === 0) {
        return cell;
    }
    return ce(Link, { to: `/play/${row.id}/reprises` }, `${cell}`);
}

function urlGenreFormatter(cell) {
    return ce(Link, { to: `/genre/${cell}` }, `${cell}`);
}

function urlRegisterFormatter(cell, row) {
    const date = dateFormatter(cell);
    return ce(Link, { to: `/register/${date}` }, date);
}

function urlSeasonFormatter(cell) {
    return ce(Link, { to: `/season/${cell}` }, `${cell}`);
}

export class PlayList extends Component {
    render() {
        const plays = this.props.plays || [];
        const options = {
            noDataText: 'Téléchargement des données ...',
            sizePerPage: 50,
        };
        return ce(
            Card,
            { className: mdlclass(12), style: { fontSize: '1em' } },
            ce(
                CardText,
                { style: { margin: 'auto', fontSize: '1em' } },
                ce(
                    BootstrapTable,
                    {
                        options: options,
                        data: plays,
                        hover: true,
                        pagination: true,
                    },
                    ce(
                        TableHeaderColumn,
                        {
                            dataField: 'id',
                            isKey: true,
                            hidden: true,
                        },
                        'ID',
                    ),
                    ce(
                        TableHeaderColumn,
                        {
                            dataField: 'title',
                            dataSort: true,
                            dataFormat: urlPlayFormatter,
                            width: '25%',
                            filter: {
                                type: 'TextFilter',
                                placeholder: 'Rechercher un titre',
                                delay: 300,
                            },
                        },
                        'Titre',
                    ),
                    ce(
                        TableHeaderColumn,
                        {
                            dataField: 'author_name',
                            dataSort: true,
                            dataFormat: urlAuthorFormatter,
                            width: '25%',
                            filter: {
                                type: 'TextFilter',
                                placeholder: 'Rechercher un auteur',
                                delay: 300,
                            },
                        },
                        'Auteur',
                    ),
                    ce(
                        TableHeaderColumn,
                        {
                            dataField: 'genre',
                            width: '10%',
                            dataSort: true,
                            dataFormat: urlGenreFormatter,
                            filter: {
                                type: 'TextFilter',
                                placeholder: 'Rechercher un genre',
                                delay: 300,
                            },
                        },
                        'Genre',
                    ),
                    ce(
                        TableHeaderColumn,
                        {
                            dataField: 'nbperfs',
                            dataSort: true,
                            width: '15%',
                        },
                        'Nombre de représentations',
                    ),
                    ce(
                        TableHeaderColumn,
                        {
                            dataField: 'nbreprises',
                            width: '15%',
                            dataSort: true,
                            dataFormat: urlRepriseFormatter,
                        },
                        'Nombre de reprises',
                    ),
                    ce(
                        TableHeaderColumn,
                        {
                            dataField: 'firstdate',
                            width: '10%',
                            dataFormat: urlRegisterFormatter,
                        },
                        'date de la première',
                    ),
                ),
            ),
        );
    }
}

PlayList.propTypes = {
    plays: PropTypes.array,
};

function playMainCardView({ playData }) {
    const playOverviewClassNames = mdlclass({ col: 2, tablet: 4, phone: 3 });
    const playOverviewStyle = { textAlign: 'center' };
    const pictoDescrLabelStyle = {
        fontSize: '14px',
        display: 'block',
        color: 'rgba(0,0,0,.54)',
        borderBottom: '1px solid #009687',
    };
    const pictoLabelStyle = {
        fontSize: '18px',
        color: 'rgba(0,0,0,.54)',
        marginTop: '15px',
    };

    const links = [
        {
            img:
                'https://cdn4.iconfinder.com/data/icons/infy-basic-collection/53/user-128.png',
            label: 'Auteur',
            value: playData.author,
            url: `/author/${playData.author_id}`,
        },
        {
            img:
                'https://cdn2.iconfinder.com/data/icons/chat-and-sms/64/sms_chat_web_text-128.png',
            label: 'Discours',
            value: playData.prose_vers,
        },
        {
            img:
                'https://cdn0.iconfinder.com/data/icons/constructivism-for-the-bank/64/constr_account_statements-128.png',
            label: 'Actes',
            value: playData.acts,
        },
        {
            img:
                'https://cdn2.iconfinder.com/data/icons/ballicons-2-free/100/theatre-128.png',
            label: 'Genre',
            value: playData.genre,
            url: `/genre/${playData.genre}`,
        },
        {
            img:
                'https://cdn2.iconfinder.com/data/icons/rafif-rounded-flat-vol-3/512/music-128.png',
            label: 'Musique / Danse / Machie',
            value: playData.musique_danse_machine === false ? 'non' : 'oui',
        },
        {
            img:
                'https://cdn1.iconfinder.com/data/icons/vote-and-rewards-1/65/49-128.png',
            label: 'Prologue',
            value: playData.prolog === false ? 'non' : 'oui',
        },
    ];

    return ce(
        'section',
        {
            className: 'section--center mdl-shadow--2dp',
            style: { justifyContent: 'center' },
        },
        ce(
            'section',
            { className: 'section--center', style: { marginBottom: '50px' } },
            ce(
                'h2',
                { style: { textAlign: 'center' } },
                ce('img', {
                    src:
                        'https://cdn2.iconfinder.com/data/icons/game-assets-3/1000/RedRibbon.png',
                    style: { width: '250px', display: 'block', margin: 'auto' },
                }),
                playData.title,
            ),
        ),
        ce(
            'section',
            {
                className: 'section--center mdl-grid',
                style: { justifyContent: 'center' },
            },
            ...links.map(linkdef => {
                let value = ce(
                    'span',
                    { style: pictoLabelStyle },
                    linkdef.value,
                );
                if (linkdef.url) {
                    value = ce(Link, { to: linkdef.url }, value);
                }
                return ce(
                    'div',
                    {
                        className: playOverviewClassNames,
                        style: playOverviewStyle,
                    },
                    ce('img', { src: linkdef.img, style: { width: '60px' } }),
                    ce(
                        'p',
                        { style: { padding: '10px 60px 10px 60px' } },
                        ce(
                            'span',
                            { style: pictoDescrLabelStyle },
                            linkdef.label,
                        ),
                        value,
                    ),
                );
            }),
        ),
    );
}

class PerformanceCardView extends Component {
    componentDidMount() {
        const { nb_perfs } = this.props.playData;
        return new Highcharts.Chart({
            chart: {
                renderTo: 'performanceschart',
                type: 'column',
                zoomType: 'x',
            },
            title: {
                text: ' ',
            },
            xAxis: {
                categories: nb_perfs.map(x => `${x.season}`),
            },
            yAxis: {
                title: {
                    text: 'Performances',
                },
            },
            series: [
                {
                    name: this.props.playData.title,
                    data: nb_perfs.map(x => x.nb_perfs),
                },
            ],
        });
    }

    render() {
        let nbPerfs = 0;
        this.props.playData.nb_perfs.map(p => (nbPerfs += p.nb_perfs));

        return ce(
            Card,
            { className: mdlclass(12) },
            ce(
                CardTitle,
                { style: STYLES.titleChart },
                `Performances (${nbPerfs})`,
            ),
            ce(
                CardText,
                { style: { margin: 'auto' } },
                ce('div', { id: 'performanceschart' }),
            ),
        );
    }
}

PerformanceCardView.propTypes = {
    playData: PropTypes.object,
};

export class PlayPrimaryView extends Component {
    render() {
        if (this.props.loading === false) {
            return ce(
                'section',
                null,
                ce(
                    'div',
                    { id: 'overview' },
                    ce(playMainCardView, { playData: this.props.mainentity }),
                ),
                ce(PerformanceCardView, { playData: this.props.mainentity }),
            );
        } else {
            return ce(Spinner, { style: { margin: 'auto', display: 'block' } });
        }
    }
}

PlayPrimaryView.propTypes = {
    loading: PropTypes.bool,
    mainentity: PropTypes.object,
};

export function repriseList({ reprises, loading }) {
    if (loading === false) {
        const options = {
            noDataText: 'Téléchargement des données ...',
            sizePerPage: 50,
        };
        return ce(
            Card,
            { className: mdlclass(12), style: { fontSize: '1em' } },
            ce(
                CardText,
                { style: { margin: 'auto', fontSize: '1em' } },
                ce(
                    BootstrapTable,
                    {
                        options: options,
                        data: reprises,
                        hover: true,
                        pagination: true,
                    },
                    ce(
                        TableHeaderColumn,
                        {
                            dataField: 'date',
                            isKey: true,
                            hidden: true,
                        },
                        'ID',
                    ),
                    ce(
                        TableHeaderColumn,
                        {
                            dataField: 'season',
                            dataSort: true,
                            dataFormat: urlSeasonFormatter,
                            filter: {
                                type: 'TextFilter',
                                placeholder: 'Rechercher une saison',
                                delay: 300,
                            },
                        },
                        'Saison',
                    ),
                    ce(
                        TableHeaderColumn,
                        {
                            dataField: 'date',
                            dataSort: true,
                            dataFormat: urlRegisterFormatter,
                            filter: {
                                type: 'TextFilter',
                                placeholder: 'Rechercher une date',
                                delay: 300,
                            },
                        },
                        'Date',
                    ),
                    ce(
                        TableHeaderColumn,
                        {
                            dataField: 'receipts',
                            dataSort: true,
                        },
                        'Recettes (livres)',
                    ),
                ),
            ),
        );
    } else {
        return ce(Spinner, { style: { margin: 'auto', display: 'block' } });
    }
}
