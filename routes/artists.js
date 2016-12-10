const express = require('express');
const router = express.Router();
const Factory = require('../model/service/serviceFactory')
const cacheMiddleware = require('../middleware/cache')

const spotifyService = Factory.spotifyService

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

    spotifyService.getArtistInfoWithAlbums(id, page, limit, (err, artist) => {
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