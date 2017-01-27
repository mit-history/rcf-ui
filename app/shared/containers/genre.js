import {connect} from 'react-redux';

import connectDataFetchers from '..';
import {actionTypes} from '../actions';
import {GenreList as BaseGenreList, GenrePrimaryView as BaseGenrePrimaryView} from '../components/genre';



function genreListMSTP(state) {
    return {genres: state.genres};
}


export const GenreList = connect(genreListMSTP)(
    connectDataFetchers(BaseGenreList, {
        fetcher: 'fetchGenres',
        success: actionTypes.GENRES_FETCHED
    }));

function genreMSTP(state) {
    return {mainentity: state.mainentity, loading: state.loading};
}

export const GenrePrimaryView = connect(genreMSTP)(
    connectDataFetchers(BaseGenrePrimaryView, {
        fetcher: 'fetchGenre',
        success: actionTypes.GENRE_FETCHED
    }));
