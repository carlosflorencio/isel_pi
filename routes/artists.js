const express = require('express');
const router = express.Router();
const spotifyRepo = require('../data/SpotifyRepository')
const DataService = require('../model/service/spotifyService')
const cacheMiddleware = require('../middleware/cache')

const dataService = new DataService(spotifyRepo)

/*
|--------------------------------------------------------------------------
| Artists
|--------------------------------------------------------------------------
*/
/**
 * Artists Controller
 * Shows all the artist info and his albums paginated
 *
 * Cached for the time of the header Cache-Control from spotify
 */
router.get('/:artist', cacheMiddleware(), function(req, res, next) {
    const page = req.query.page || 1
    const limit = req.query.limit || 10
    const id = req.params.artist

    dataService.getArtistInfoWithAlbums(id, page, limit, (err, artist) => {
        if (err)
            return next(err)

        res.locals.expire = artist.expire
        res.render('pages/artist', {
            title: artist.name,
            artist: artist
        })
    })
});



module.exports = router;