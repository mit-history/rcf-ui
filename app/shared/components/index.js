import {createElement as ce} from 'react';
import {Link} from '../urls';
import {browserHistory} from 'react-router';

import 'react-mdl/extra/material.min';
import {Layout, Header, Navigation} from 'react-mdl';

import AutoComplete from './autocomplete';
import {HomeView} from '../containers/home';
import {buildURL} from '../urls';


function navigateToItem(item) {
    browserHistory.push(buildURL(`/${item.type}/${item.id}`));
}


/**
 * helper function to generate the list of mdl-cell-xxx css classes
 * Usage:
 *    mdlclass({col: 4, phone: 6})
 *    → 'mdl-cell mdl-cell--4-col mdl-cell--4-desktop mdl-cell--4-tablet mdl-cell--6-phone'
 *    mdlclass(4) // no specific formfactor, just outputs -col
 *    → 'mdl-cell mdl-cell--4-col'
 **/
export function mdlclass({col=12, desktop=col, tablet=desktop, phone=tablet}={}) {
    if (arguments.length === 1 && typeof arguments[0] === 'number') {
        return `mdl-cell mdl-cell--${arguments[0]}-col`;
    }
    return `mdl-cell mdl-cell--${col}-col mdl-cell--${desktop}-desktop mdl-cell--${tablet}-tablet mdl-cell--${phone}-phone`;
}


export function numberWithSpaces(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}


export default ({children}) => {

    function createNavLinkStyle(currentPath) {
      let navLinkStyle =  {fontVariant: "small-caps", fontSize: "1.5em", textDecoration: "none"};
      if(children === null) return navLinkStyle;
      if(currentPath === children.props.route.path){
        navLinkStyle.backgroundColor = "#05867a";
      }else {
        navLinkStyle.backgroundColor = "transparent";
      }

      return navLinkStyle;
    }

    return ce(Layout, null,
              ce(Header, null,
                 ce(Navigation, null,
                    ce(Link,
                      {to: '/', style: {fontVariant: "small-caps", fontSize: "1.5em", fontWeight: "bold" }, className: "mdl-layout-title"},
                      ce('img', {src: buildURL('/images/cfrp-logo-top-nav.png'), style:{maxHeight: "50px", marginRight: "15px", textDecoration: "none"}}), 'registres de la comédie-française'),
                    ce(Link, {to: '/authors', style: createNavLinkStyle('authors')}, 'auteurs'),
                    ce(Link, {to: '/plays', style: createNavLinkStyle('plays')}, 'oeuvres'),
                    ce(Link, {to: '/seasons', style: createNavLinkStyle('seasons')}, 'saisons'),
                    ce(Link, {to: '/genres', style: createNavLinkStyle('genres')}, 'genres'),
                   ),
                 ce('div', {className: 'mdl-layout-spacer'}),
                 ce(AutoComplete, {
                     onItemClick: navigateToItem,
                     onItemSelect: navigateToItem,
                 })),
              children);
};
