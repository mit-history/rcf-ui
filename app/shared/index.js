import {Component, createElement as ce} from 'react';

import {CardText} from 'react-mdl';

export const pre = (data) => ce('pre', null, JSON.stringify(data, null, 2));


export function zeroPad(int){
    return ('00' + int).slice(-2);
}


export function dateFormatter(date) {
    date = new Date(date);  // XXX when data comes from server (i.e. json), dates are actually strings
    return `${date.getFullYear()}-${zeroPad(date.getMonth()+1)}-${zeroPad(date.getDate())}`;
}


export function checkboxFormatter(cell) {
    return ce('input', {type: 'checkbox', checked: cell});
}


export function infoprops(items) {
    const infos = items
          .filter(item => item.value !== null &&
                  item.value !== undefined &&
                  item.value !== '')
          .map(item =>
               ce('p', {className: 'item'},
                  item.label ? ce('span', {className: item.labelClass || 'item-label'}, item.label) : null,
                  ce('span', {className: item.valueClass || 'item-value'}, item.value))
              );
    return ce(CardText, {id: 'entityInfos'}, ...infos);
}


export default function connectDataFetchers(componentClass, fetchActionConfig) {

    return class WrappedComponent extends Component {

        static fetchData({dispatch, params = {}}) {
            return dispatch(Object.assign({type: 'FETCH', params},
                                          fetchActionConfig));
        }

        componentDidMount() {
            if (!window.__INITIAL_RENDERING__) {
                WrappedComponent.fetchData(this.props);
            }
            window.__INITIAL_RENDERING__ = false;
        }

        componentWillReceiveProps(nextProps) {
            if (nextProps.params !== this.props.params) { // route changed
                WrappedComponent.fetchData(nextProps);
            }
        }

        render() {
            return ce(componentClass, this.props);
        }
    };
}
