import {createElement as ce} from 'react';
import LinkReactRouter from 'react-router/lib/Link';


export function buildURL(url){
    let baseUrl = '';
    if (typeof window === 'undefined') {
        if (process.env.BASE_URL) {
            baseUrl = process.env.BASE_URL;
        }
    } else if (window.__base_url__) {
        baseUrl = window.__base_url__;
    }
    return baseUrl + url;
}

export function Link(props){
  return ce(LinkReactRouter, Object.assign({}, props, {to: buildURL(props.to)}))
}
