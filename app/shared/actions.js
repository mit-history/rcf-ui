export const actionTypes = {
    HOME_FETCHED: 'HOME_FETCHED',
    AUTHORS_FETCHED: 'AUTHORS_FETCHED',
    AUTHOR_FETCHED: 'AUTHOR_FETCHED',
    PLAYS_FETCHED: 'PLAYS_FETCHED',
    PLAY_FETCHED: 'PLAY_FETCHED',
    REPRISES_FETCHED: 'REPRISES_FETCHED',
    SEASONS_FETCHED: 'SEASONS_FETCHED',
    SEASON_FETCHED: 'SEASON_FETCHED',
    ASEASON_FETCHED: 'ASEASON_FETCHED',
    GENRES_FETCHED: 'GENRES_FETCHED',
    GENRE_FETCHED: 'GENRE_FETCHED',
    REGISTER_FETCHED: 'REGISTER_FETCHED',
    FETCHING_DATA: 'FETCHING_DATA',
};

export function fetchingData() {
    return {
        type: actionTypes.FETCHING_DATA,
    };
}

export function homeFetched(home) {
    return {
        type: actionTypes.HOME_FETCHED,
        payload: home,
    };
}

export function authorsFetched(authors) {
    return {
        type: actionTypes.AUTHORS_FETCHED,
        payload: authors,
    };
}

export function authorFetched(author) {
    return {
        type: actionTypes.AUTHOR_FETCHED,
        payload: author,
    };
}

export function playsFetched(plays) {
    return {
        type: actionTypes.PLAYS_FETCHED,
        payload: plays,
    };
}

export function playFetched(play) {
    return {
        type: actionTypes.PLAY_FETCHED,
        payload: play,
    };
}

export function reprisesFetched(reprises) {
    return {
        type: actionTypes.REPRISES_FETCHED,
        payload: reprises,
    };
}

export function seasonsFetched(seasons) {
    return {
        type: actionTypes.SEASONS_FETCHED,
        payload: seasons,
    };
}

export function seasonFetched(season) {
    return {
        type: actionTypes.SEASON_FETCHED,
        payload: season,
    };
}

export function aSeasonFetched(author, season) {
    return {
        type: actionTypes.ASEASON_FETCHED,
        payload: { author, season },
    };
}

export function genresFetched(genres) {
    return {
        type: actionTypes.GENRES_FETCHED,
        payload: genres,
    };
}

export function genreFetched(genre) {
    return {
        type: actionTypes.GENRE_FETCHED,
        payload: genre,
    };
}

export function registerFetched(register) {
    return {
        type: actionTypes.REGISTER_FETCHED,
        payload: register,
    };
}
