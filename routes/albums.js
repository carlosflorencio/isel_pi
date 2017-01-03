const express = require('express');
const router = express.Router();
const Factory = require('../model/serviceFactory')

const spotifyService = Factory.spotifyService

const loadUserPlaylists = require('./middleware/loadUserPlaylists')

/**
 * Album Controller
 * Shows the album info with tracks
 *
 * If the user is logged, playlists and invited playlists (with write access)
 * are passed to the view
 */
router.get('/:id', loadUserPlaylists, function(req, res, next) {
    const id = req.params.id
    const page = req.query.page || 1
    const limit = req.query.limit || 10

    let playlists = null,
        invitedPlaylists = null

    if(req.isAuthenticated()) {
        playlists = req.playlists
        invitedPlaylists = req.invitedPlaylists.filter(p => p.invite.writable) // only the writable ones
    }

    // Album with tracks infos, 2 requests in paralel
    spotifyService.albumTracks(id, page, limit)
        .then(album => {
            res.render('pages/album', {
                title: album.name,
                album: album,
                playlists: playlists,
                invitedPlaylists: invitedPlaylists
            })
        })
        .catch(next)
});

module.exports = router;
