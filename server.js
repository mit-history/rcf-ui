
const fs = require('fs');

const compression = require('compression');
const express = require('express');

require('babel-register');


// mock System.import implementation used by webpack2 for node
global.System = {
    import(path) {
        return Promise.resolve(require(`./app/shared/${path}`));
    },
};


const {buildURL} = require('./app/shared/urls');
const {default: serverRouter} = require('./app/server');
const {
    pgp, fetchAuthors, fetchAuthor, fetchAuthorSerieDef, fetchPlays, fetchPlay,
    fetchSeasons, fetchSeason, fetchSeasonGenreChord, fetchASeason, fetchHome,
    ftisearch, fetchGenres, fetchGenre, fetchRegister, fetchReprises,
} = require('./app/server/database');

const app = express(),
      template = fs.readFileSync('index-template.html').toString().replace(/BASE_URL/g, process.env.BASE_URL || '');

app.use(compression());

app.use(buildURL(''), express.static('static'));

app.get(buildURL('/home.json'), (req, res) => {
    fetchHome().then(home => res.json(home));
});

app.get(buildURL('/authors.json'), (req, res) => {
    fetchAuthors().then(authors => res.json(authors));
});

app.get(buildURL('/author/seriedef-:id.json'), (req, res) => {
    fetchAuthorSerieDef(req.params.id).then(seriedef => res.json(seriedef));
});

app.get(buildURL('/author/:id.json'), (req, res) => {
    fetchAuthor(req.params.id).then(authors => res.json(authors));
});

app.get(buildURL('/plays.json'), (req, res) => {
    fetchPlays().then(plays => res.json(plays));
});

app.get(buildURL('/play/:play/reprises.json'), (req, res) => {
    fetchReprises(req.params.play).then(perfs => res.json(perfs));
});

app.get(buildURL('/play/:id.json'), (req, res) => {
    fetchPlay(req.params.id).then(plays => res.json(plays));
});

app.get(buildURL('/seasons.json'), (req, res) => {
    fetchSeasons().then(seasons => res.json(seasons));
});

app.get(buildURL('/season/chord-:season.json'), (req, res) => {
    fetchSeasonGenreChord(req.params.season).then(season => res.json(season));
});

app.get(buildURL('/season/:id.json'), (req, res) => {
    fetchSeason(req.params.id).then(season => res.json(season));
});

app.get(buildURL('/aseason/:authorid/:season.json'), (req, res) => {
    fetchASeason(req.params.authorid, req.params.season).then(result => res.json(result));
});

app.get(buildURL('/genres.json'), (req, res) => {
    fetchGenres().then(genres => res.json(genres));
});

app.get(buildURL('/genre/:id.json'), (req, res) => {
    fetchGenre(req.params.id).then(genres => res.json(genres));
});

app.get(buildURL('/register/:id.json'), (req, res) => {
    fetchRegister(req.params.id).then(register => res.json(register));
});


app.get(buildURL('/search'), (req, res) => {
    ftisearch(req.query.q).then(results => res.json(results));
});

app.get(buildURL('*'), (req, res, next) => {
    serverRouter(req, res, next, template);
});


const server = app.listen(process.env.PORT || 3000, function () {
    console.log(`app ready on port ${process.env.PORT || 3000}!`);
});

server.on('close', pgp.end);
