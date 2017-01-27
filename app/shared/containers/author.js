import {connect} from 'react-redux';

import connectDataFetchers from '..';
import {actionTypes} from '../actions';
import {AuthorList as BaseAuthorList, AuthorPrimaryView as BaseAuthorPrimaryView} from '../components/author';



function authorListMSTP(state) {
    return {authors: state.authors};
}


export const AuthorList = connect(authorListMSTP)(
    connectDataFetchers(BaseAuthorList, {
        fetcher: 'fetchAuthors',
        success: actionTypes.AUTHORS_FETCHED
    }));



function authorMSTP(state) {
    return {mainentity: state.mainentity, loading: state.loading};
}

export const AuthorPrimaryView = connect(authorMSTP)(
    connectDataFetchers(BaseAuthorPrimaryView, {
        fetcher: 'fetchAuthor',
        success: actionTypes.AUTHOR_FETCHED
    }));
