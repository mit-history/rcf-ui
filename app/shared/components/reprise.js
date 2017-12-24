import { createElement as ce, Component } from 'react';
import PropTypes from 'prop-types';

import { Card, CardText } from 'react-mdl';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';

import { dateFormatter } from '..';
import { Link } from '../urls';

import {
  mdlclass,
  numberWithSpaces,
  urlPlayFormatter,
  authorFormatte,
  authorFormatter,
  urlSeasonFormatter,
} from '.';


export class RepriseList extends Component {

    render() {
        const reprises = this.props.reprises || [];
        const options = {
            noDataText: 'Téléchargement des données ...',
            sizePerPage: 50,
        };

        return ce(
            Card,
            {
                className: mdlclass({ col: 8, tablet: 12 }),
                style: { fontSize: '1em', margin: 'auto', marginTop: '10px' },
            },
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
                            dataField: 'id',
                            isKey: true,
                            hidden: true,
                        },
                        'ID',
                    ),
                    ce(
                        TableHeaderColumn,
                        {
                            dataField: 'play_title',
                            dataSort: true,
                            dataFormat: urlPlayFormatter,
                            width: '15%',
                        },
                        'Pièce',
                    ),
                    ce(
                        TableHeaderColumn,
                        {
                            dataField: 'author_name',
                            dataSort: true,
                            dataFormat: authorFormatter,
                        },
                        'Auteur',
                    ),
                    ce(
                        TableHeaderColumn,
                        {
                            dataField: 'receipts',
                            dataSort: true,
                            dataFormat: numberWithSpaces,
                            width: '15%',
                        },
                        'Recettes (livres)',
                    ),
                    ce(
                        TableHeaderColumn,
                        {
                            dataField: 'season',
                            dataSort: true,
                            dataFormat: urlSeasonFormatter,
                            width: '14%',
                        },
                        'Saison',
                    ),
                    ce(
                        TableHeaderColumn,
                        {
                            dataField: 'date',
                            dataSort: true,
                            dataFormat: dateFormatter,
                            width: '14%',
                        },
                        'Date de la reprise',
                    ),
                ),
            ),
        );
    }
}

RepriseList.propTypes = {
    reprises: PropTypes.array,
};
