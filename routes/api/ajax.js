const express = require('express')
const router = express.Router()

const Factory = require('../../model/serviceFactory')
const validateAjax = require('./../validation/ajaxValidation')
const validatePlaylist = require('../validation/playlistsValidation')

const playlistService = Factory.playlistService


/*
|--------------------------------------------------------------------------
| Add track to playlist
|--------------------------------------------------------------------------
*/
router.put('/playlist/:playlist/add/:track',
    validateAjax.needsLogin,
    validatePlaylist.playlistExists,
    validatePlaylist.accessToPlaylist,
    validatePlaylist.playlistWriteAccess,
    validatePlaylist.trackNotExistsInPlaylist,
    function (req, res, next) {
        const trackId = req.params.track

        req.playlist.tracks.push(trackId)

        playlistService.updatePlaylist(req.playlist)
            .then(plist => {
                res.ajaxResponse("Track added to playlist " + plist.name + "!")
            })
            .catch(next)
    })

/*
|--------------------------------------------------------------------------
| Remove track from playlist
|--------------------------------------------------------------------------
*/
router.delete('/playlist/:playlist/track/:track/remove',
    validateAjax.needsLogin,
    validatePlaylist.playlistExists,
    validatePlaylist.accessToPlaylist,
    validatePlaylist.playlistWriteAccess,
    validatePlaylist.trackExistsInPlaylist,
    function (req, res, next) {
        req.playlist.tracks.splice(req.trackIdx, 1) // remove the track from the playlist

        playlistService.updatePlaylist(req.playlist)
            .then(plist => {
                res.ajaxResponse("Track removed with success!")
            })
            .catch(next)
    })


module.exports = router