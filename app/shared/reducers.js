import { actionTypes } from './actions';

export default (state = {}, action) => {
    switch (action.type) {
        case actionTypes.FETCHING_DATA:
            return Object.assign({}, state, { loading: true });
            break;
        case actionTypes.HOME_FETCHED:
            return Object.assign({}, state, {
                mainentity: action.payload,
                loading: false,
            });
            break;
        case actionTypes.AUTHORS_FETCHED:
            return Object.assign({}, state, { authors: action.payload });
            break;
        case actionTypes.AUTHOR_FETCHED:
            return Object.assign({}, state, {
                mainentity: action.payload,
                loading: false,
            });
            break;
        case actionTypes.PLAYS_FETCHED:
            return Object.assign({}, state, { plays: action.payload });
            break;
        case actionTypes.PLAY_FETCHED:
            return Object.assign({}, state, {
                mainentity: action.payload,
                loading: false,
            });
            break;
        case actionTypes.REPRISES_FETCHED:
            return Object.assign({}, state, {
                reprises: action.payload,
                loading: false,
            });
            break;
        case actionTypes.ALL_REPRISES_FETCHED:
            return Object.assign({}, state, {
                reprises: action.payload,
                loading: false,
            });
            break;
        case actionTypes.SEASONS_FETCHED:
            return Object.assign({}, state, { seasons: action.payload });
            break;
        case actionTypes.SEASON_FETCHED:
            return Object.assign({}, state, {
                mainentity: action.payload,
                loading: false,
            });
            break;
        case actionTypes.ASEASON_FETCHED:
            return Object.assign({}, state, {
                mainentity: action.payload,
                loading: false,
            });
            break;
        case actionTypes.GENRES_FETCHED:
            return Object.assign({}, state, { genres: action.payload });
            break;
        case actionTypes.GENRE_FETCHED:
            return Object.assign({}, state, {
                mainentity: action.payload,
                loading: false,
            });
            break;
        case actionTypes.REGISTER_FETCHED:
            return Object.assign({}, state, {
                mainentity: action.payload,
                loading: false,
            });
            break;
        default:
            return state;
    }
};
