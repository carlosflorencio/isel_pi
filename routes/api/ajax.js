const express = require('express')
const router = express.Router()

const Factory = require('../../model/serviceFactory')
const validateAjax = require('./../validation/ajaxValidation')

const playlistService = Factory.playlistService

/*
 |--------------------------------------------------------------------------
 | Add track to playlist
 |--------------------------------------------------------------------------
 */
router.get('/add-track',
    validateAjax.needsLogin,
    function (req, res, next) {
    //res.status(400)
    res.send(req.user)
})



































// router.post('/add-track',
//     auth('/user/login'),
//     validate.playlistExists,
//     validate.accessToPlaylist,
//     validate.playlistWriteAccess,
//     validate.trackNotExistsInPlaylist,
//     function (req, res, next) {
//         const trackId = req.body.track
//
//         res.send(trackId)
//
//         //req.playlist.tracks.push(trackId)
//
//         // playlistService.updatePlaylist(req.playlist)
//         //     .then(plist => {
//         //         res.redirectWithMessage('back',
//         //             'Track added with success!'
//         //         )
//         //     })
//         //     .catch(next)
//     })

module.exports = router