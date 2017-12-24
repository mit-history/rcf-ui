import { DEFAULT_INITIAL_STATE } from '../shared/store';

import {
    fetchAuthors,
    fetchAuthor,
    fetchPlays,
    fetchPlay,
    fetchSeasons,
    fetchSeason,
    fetchASeason,
    fetchHome,
    fetchGenres,
    fetchGenre,
    fetchRegister,
    fetchReprises,
    fetchAllReprises,
} from './database';

export const fetchers = {
    fetchHome: params => fetchHome(),

    fetchAuthors: params => fetchAuthors(),
    fetchAuthor: params => fetchAuthor(params.id),

    fetchPlays: params => fetchPlays(),
    fetchPlay: params => fetchPlay(params.id),
    fetchReprises: params => fetchReprises(params.play),

    fetchAllReprises: params => fetchAllReprises(params.play),

    fetchSeasons: params => fetchSeasons(),
    fetchSeason: params => fetchSeason(params.id),

    fetchGenres: params => fetchGenres(),
    fetchGenre: params => fetchGenre(params.id),

    fetchRegister: params => fetchRegister(params.id),

    fetchASeason: params => fetchASeason(params.authorid, params.season),

    default: params => Promise.resolve(DEFAULT_INITIAL_STATE),
};
