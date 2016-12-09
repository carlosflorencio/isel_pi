const express = require('express');
const router = express.Router();
const spotifyRepo = require('../data/SpotifyRepository')
const DataService = require('../model/service/spotifyService')

const dataService = new DataService(spotifyRepo)

/*
|--------------------------------------------------------------------------
| Home
|--------------------------------------------------------------------------
*/
router.get('/', function(req, res, next) {
    res.render('pages/home', { title: 'Home' });
});

/*
|--------------------------------------------------------------------------
| Search artist
|--------------------------------------------------------------------------
*/
/**
 * Artist search controller
 * Receives the Artist from the query string parameter q or in the path
 * ex: /artist or /?q=artist
 * Also looks for pagination parameters page and limit
 * ex: /artist?page=2&limit=10
 */
router.get('/search/:artist?', function(req, res, next) {
    const page = req.query.page || 1
    const limit = req.query.limit || 16
    const artist = req.params.artist || req.query.q

    if (!artist)
        return next(new Error("No artist provided!"))

    dataService.searchArtist(artist, page, limit, (err, collection) => {
        if (err) return next(err)

        res.render('pages/search', {
            title: collection.total + " Results for " + artist,
            query: artist,
            collection: collection
        })
    })
});


module.exports = router;