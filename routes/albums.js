const express = require('express');
const router = express.Router();
const Factory = require('../model/serviceFactory')

const spotifyService = Factory.spotifyService
const playlistService = Factory.playlistService


/**
 * Album Controller
 * Shows the album info with tracks
 */
router.get('/:id', function(req, res, next) {
    const id = req.params.id
    const page = req.query.page || 1
    const limit = req.query.limit || 10

    // if(req.user) {
    //     playlistService.playlistsOfUser(req.user.id, (err, playlists) => {
    //
    //
    //
    //     })
    // }

    if(page == 1 && limit == 50) { // we only want 50 tracks
        // we save one request with this ahah
        spotifyService.albumInfo(id, albumCallback(res, next))
        return
    }

    // 2 requests in paralel
    spotifyService.albumTracks(id, page, limit, albumCallback(res, next))
});

/**
 * Add album to the response
 *
 * @param res
 * @param next
 * @return {Function}
 */
function albumCallback(res, next) {
    return function (err, album) {
        if (err)
            return next(err)

        res.render('pages/album', {
            title: album.name,
            album: album
        })
    }
}

module.exports = router;
