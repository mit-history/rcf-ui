import {createElement as ce, Component} from 'react';
import PropTypes from 'prop-types';

import {Link} from '../urls';
import {Card, CardTitle, CardText, Spinner} from 'react-mdl';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';

import {mdlclass, numberWithSpaces} from '.';
import {STYLES} from '../styles';


export class GenreList extends Component {
    render() {

        function urlFormatter(cell, row) {
            return ce(Link, {to: `/genre/${row.genre}`}, cell )
        }

        const genres = this.props.genres || [];
        var options = {
            noDataText: 'Téléchargement des données ...',
        };

        return ce(Card, {className: mdlclass({col: 6, tablet: 12}),
                         style: {margin: "auto", marginTop: "10px"}},
                  ce(CardText, {style: {margin: "auto",  fontSize: "1em"}},
                     ce(BootstrapTable, {options:options, data: genres, hover: true},
                        ce(TableHeaderColumn, {dataField: "genre",
                                               isKey:true,
                                               dataSort: true,
                                               dataFormat: urlFormatter},
                           'Genre'),
                        ce(TableHeaderColumn, {dataField: "nb_plays",
                                               dataSort: true},
                           'Nombre de pièces')
                       )));
    }
}


GenreList.propTypes = {
    genres: PropTypes.array,
};


function genrePlayView({genreData}){

    function urlFormatter(cell, row) {
        return ce(Link, {to: `/play/${row.play_id}`}, cell )
    }

    var options = {
        noDataText: 'Téléchargement des données ...',
        sizePerPage: 15,
    };

    return ce(Card, {className: mdlclass({col: 9, tablet: 12}),
                     style:{margin: "auto"}},
              ce(CardTitle, {style: STYLES.titleChart}, 'pièces'),
              ce(CardText, {style: {margin: "auto", fontSize: "1em"}},
                 ce(BootstrapTable, {data: genreData, hover: true, pagination: true, options: options},
                    ce(TableHeaderColumn, {dataField: "play_id",
                                           isKey: true,
                                           hidden: true}, 'ID'),
                    ce(TableHeaderColumn, {dataField: "title",
                                           dataSort: true,
                                           filter: {
                                               type: 'TextFilter',
                                               placeholder: 'Rechercher un titre',
                                               delay: 300},
                                           dataFormat: urlFormatter},
                       'Titre'),
                    ce(TableHeaderColumn, {dataField: "receipts",
                                           dataSort: true,
                                           dataFormat: numberWithSpaces},
                       'Recettes (livres)'),
                    ce(TableHeaderColumn, {dataField: "nb_perfs",
                                           dataSort: true,
                                           width: '140px'},
                       'Performances')
                   )
                ));
}


export class GenrePrimaryView extends Component {

    render() {
        if (!this.props.loading) {
            return ce('div', {id: 'overview'},
                      ce('section', {className: "section--center mdl-grid"},
                         ce(genrePlayView, {genreData: this.props.mainentity})
                        )
                     );
        } else {
            return ce(Spinner, {style:{margin: "auto", display: "block"}});
        }
    }
}


GenrePrimaryView.propTypes = {
    loading: PropTypes.bool,
    mainentity: PropTypes.array,
};
