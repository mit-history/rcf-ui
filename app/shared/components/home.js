import {createElement as ce, Component, PropTypes} from 'react';

import {Card, Spinner} from 'react-mdl';

import {mdlclass} from '.';
import {Link} from '../urls';


function HomeView({homeData}) {
    const titleStyle = {
        textAlign: "center",
        fontSize: "3em",
        fontVariant: "small-caps",
        color: "#009688",
        justifyContent: "center",
        marginTop: "50px",
        marginBottom: "50px",
    }

    const card = {
        backgroundColor: "transparent",
        justifyContent: "center",
        textAlign: "center",
    }

    const card_number = {
        fontSize: "2em",
    }

    const card_label = {
        fontSize: "1.5em",
        fontVariant: "small-caps",
        color: "#757575",
    }

    const sections = [
        {count: homeData.nbAuthors, label: 'auteurs', url: '/authors'},
        {count: homeData.nbPlays, label: 'œuvres', url: '/plays'},
        {count: homeData.nbGenres, label: 'genres', url: '/genres'},
        {count: homeData.nbSeasons, label: 'saisons', url: '/seasons'},
    ];

    return ce('div', null,
              ce('h1', {style: titleStyle}, "registres de la comédie-française"),
              ce('section', {className: "mdl-grid", style: {justifyContent: "center"}} ,
                 ...sections.map(s =>
                                 ce(Card, {className: mdlclass({col: 3, tablet: 8}), style: card},
                                    ce('span', {style: card_number}, s.count),
                                    ce('span', {style: card_label},
                                       ce(Link, {to: s.url}, s.label))))));
}


export class Home extends Component {

    render() {
        if (!this.props.loading) {
            return ce('section', null,
              ce('div', null, ce(HomeView, {homeData: this.props.mainentity}))
            );
        } else {
            return ce(Spinner, {style:{margin: "auto", display: "block"}});
        }
    }
}


Home.propTypes = {
    loading: PropTypes.bool,
    mainentity: PropTypes.object,
};
