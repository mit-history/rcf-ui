import {createElement as ce, Component, PropTypes} from 'react';

import {browserHistory} from "react-router";

import {Textfield} from 'react-mdl';

import classnames from 'classnames';

import Dropdown from '../react-mdl-extra/Dropdown';
import OptionList from '../react-mdl-extra/OptionList';
import Option from '../react-mdl-extra/Option';

import KEYCODE from '../react-mdl-extra/keycodes';

import {buildURL} from '../urls';


export function cfrsearch(term) {
    if (!term.length) {
        return Promise.resolve([]);
    }
    return fetch(buildURL(`/search?q=${encodeURIComponent(term)}`))
        .then(res => res.json());
}

export function authorsearch(term) {
    return cfrsearch(term)
        .then(results => results.filter(item => item.type === 'author'));
}


class CFRAutoComplete extends Component {

    static propTypes = {
        align: PropTypes.string,
        className: PropTypes.string,
        error: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
        floatingLabel: PropTypes.bool,
        forceSelect: PropTypes.bool,
        label: PropTypes.string.isRequired,
        offset: PropTypes.string,
        onFocus: PropTypes.func,
        onBlur: PropTypes.func,
        onChange: PropTypes.func,
        showMenuBelow: PropTypes.bool,
        value: PropTypes.any,
        itemfetcher: PropTypes.func,
        onItemClick: PropTypes.func,
        onItemSelect: PropTypes.func,
    };

    static defaultProps = {
        align: 'tl bl',
        offset: '20px 0',
    };

    constructor(props) {
        super(props);
        this.state = {value: null, focused: false, items: [], selectedIndex: null};
        this.keyDown = this.keyDown.bind(this);
        this.onItemClick = this.onItemClick.bind(this);
        this.onTextfieldChange = this.onTextfieldChange.bind(this);
        this.onTextfieldFocus = this.onTextfieldFocus.bind(this);
        this.onTextfieldBlur = this.onTextfieldBlur.bind(this);
    }

    componentDidMount() {
        document.addEventListener('keydown', this.keyDown, true);
    }

    componentWillUnmount() {
        document.removeEventListener('keydown', this.keyDown, true);
    }

    onItemClick(newValue, item) {
        const {value, onChange} = this.props;
        if (this.props.onItemClick) {
            this.props.onItemClick(item);
        }
        this.setState({value: null, items: []});
        if (value !== newValue && onChange) {
            onChange(newValue);
        }
    }

    onTextfieldChange(e) {
        const {onChange} = this.props;
        const value = e.target.value;
        this.setState({value});
        this.props.itemfetcher(value).then(suggestions => {
            this.setState({items: suggestions});
        });
        if (onChange) {
            onChange(value);
        }
    }

    onTextfieldFocus() {
        const {value, onFocus} = this.props;
        this.setState({focused: true});
        if (onFocus) {
            onFocus(value);
        }
    }

    onTextfieldBlur() {
        const {value, onBlur} = this.props;
        this.setState({focused: false});
        if (onBlur) {
            onBlur(value);
        }
    }

    keyDown(e) {
        if (!this.state.items.length) {
            return;
        }
        if (e.keyCode === KEYCODE.DOWN || e.keyCode === KEYCODE.UP) {
            let newState;
            if (e.keyCode === KEYCODE.DOWN) {
                newState = this.state.selectedIndex === null ?
                    0 :
                    (this.state.selectedIndex + 1) % this.state.items.length;
            } else {
                newState = this.state.selectedIndex === null ?
                    this.state.items.length - 1: this.state.selectedIndex - 1;
                if (newState < 0) {
                    newState += this.state.items.length;
                }
            }
            this.setState({selectedIndex: newState,
                           value: this.state.items[newState].label});

            e.preventDefault();
            e.stopPropagation();
        }
        if (e.keyCode === KEYCODE.ENTER) {
            if (this.selectedIndex !== null) {
                const item = this.state.items[this.state.selectedIndex];
                if (this.props.onItemSelect) {
                    this.props.onItemSelect(item);
                }
                this.setState({value: null, items: []});
            } else {
                console.log('should trigger search');
            }
            e.preventDefault();
            e.stopPropagation();
        }
    }

    render() {
        const {
            align, className, error, floatingLabel,
            label, offset, readOnly,
            onItemClick, onItemSelect,
        } = this.props;
        let value = this.props.value;
        const {focused, value: stateValue, items} = this.state

        // create options
        const children = items.map((item, idx) => {
            const value = item.id;
            const data = item.label;
            return ce(Option, {key: `${item.type}${value}`, value: value, item}, data);
        });

        if (this.state.selectedIndex !== null && this.state.selectedIndex < items.length) {
            value = items[this.state.selectedIndex].id;
        }
        const item = items.find(item => item.id === value);
        const data = item && item.label || '';
        const inputValue = typeof stateValue === 'string' ? stateValue : data;
        const inputProps = {
            error,
            floatingLabel,
            label,
            ref: ref => this.input = ref,
            type: 'text',
            onChange: this.onTextfieldChange,
            onFocus: this.onTextfieldFocus,
            onBlur: this.onTextfieldBlur,
            value: inputValue || "",
        };

        // calculate main class
        const mainClass = classnames({
            'mdl-autocomplete': true,
            'mdl-autocomplete--disabled': false,
            'mdl-autocomplete--error': error,
            'mdl-autocomplete--focused': focused,
        }, className);

        // calculate dropdown props
        const dropdownProps = {
            align,
            offset,
            target: ce(Textfield, inputProps),
            useTargetWidth: true,
        };
        return ce('div', {className: mainClass},
                  ce(Dropdown, dropdownProps,
                     ce(OptionList, {value, onItemClick: this.onItemClick}, children)),
                  ce('i', className: 'mdl-autocomplete__arrow'));
    }

}

export default ({title, onItemClick, onItemSelect, itemfetcher}) => {
    return ce('form', {action: '#', autoComplete: 'off'},
              ce(CFRAutoComplete, {
                  label: title || 'Search…',
                  itemfetcher: itemfetcher || cfrsearch,
                  floatingLabel: true,
                  expandable: true,
                  expandableIcon: 'search',
                  onItemClick,
                  onItemSelect,
              }));
};
