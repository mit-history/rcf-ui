import { DEFAULT_INITIAL_STATE } from '../shared/store';
import { buildURL } from '../shared/urls';

export const fetchers = {
    fetchHome: params => fetch(buildURL('/home.json')).then(res => res.json()),

    fetchAuthors: params =>
        fetch(buildURL('/authors.json')).then(res => res.json()),
    fetchAuthor: params =>
        fetch(buildURL(`/author/${params.id}.json`)).then(res => res.json()),

    fetchPlays: params =>
        fetch(buildURL('/plays.json')).then(res => res.json()),
    fetchPlay: params =>
        fetch(buildURL(`/play/${params.id}.json`)).then(res => res.json()),
    fetchReprises: params =>
        fetch(buildURL(`/play/${params.play}/reprises.json`)).then(res =>
            res.json(),
        ),

    fetchAllReprises: params =>
        fetch(buildURL(`/reprises.json`)).then(res =>
            res.json(),
        ),

    fetchSeasons: params =>
        fetch(buildURL('/seasons.json')).then(res => res.json()),
    fetchSeason: params =>
        fetch(buildURL(`/season/${params.id}.json`)).then(res => res.json()),

    fetchASeason: params =>
        fetch(
            buildURL(`/aseason/${params.authorid}/${params.season}.json`),
        ).then(res => res.json()),

    fetchGenres: params =>
        fetch(buildURL('/genres.json')).then(res => res.json()),
    fetchGenre: params =>
        fetch(buildURL(`/genre/${params.id}.json`)).then(res => res.json()),

    fetchRegister: params =>
        fetch(buildURL(`/register/${params.id}.json`)).then(res => res.json()),

    default: params => Promise.resolve(DEFAULT_INITIAL_STATE),
};
