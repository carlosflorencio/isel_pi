const express = require('express')
const router = express.Router()
const auth = require('connect-ensure-login').ensureAuthenticated
const Factory = require('../model/serviceFactory')
const validate = require('./validation/playlistsValidation')

const playlistService = Factory.playlistService
const spotifyService = Factory.spotifyService
const inviteService = Factory.inviteService

const loadUserPlaylists = require('./middleware/loadUserPlaylists')

// All this routes need to be authenticated
router.use(auth('/user/login'))

/*
|--------------------------------------------------------------------------
| Playlists list
|--------------------------------------------------------------------------
*/
router.get('/', loadUserPlaylists, function (req, res, next) {
    res.render('playlist/index', {
        title: "Playlists",
        playlists: req.playlists,
        invitedPlaylists: req.invitedPlaylists
    })
})


/*
|--------------------------------------------------------------------------
| Playlist details
|--------------------------------------------------------------------------
*/
router.get('/details/:playlist', validate.playlistExists, validate.accessToPlaylist, function (req, res, next) {
    const playlist = req.playlist

    if(playlist.tracks.length == 0) { // we save one request to spotify
        return res.render('playlist/details', {title: playlist.name, playlist: playlist, tracks: []})
    }

    spotifyService.getTracks(playlist.tracks)
        .then(tracks => {
            res.render('playlist/details', {title: playlist.name, playlist: playlist, tracks: tracks})
        })
        .catch(next)
})


/*
|--------------------------------------------------------------------------
| Create playlist
|--------------------------------------------------------------------------
*/
router.get('/create', function (req, res, next) {
    res.render('playlist/create', {title: "New playlist"})
})

router.post('/create', validate.playlistName, function (req, res, next) {
    const name = req.body.name

    playlistService.createPlaylist(req.user.id, name)
        .then(playlist => {
            res.redirectWithMessage('/playlists', playlist.name + ' playlist created!')
        })
        .catch(next)
})


/*
|--------------------------------------------------------------------------
| Delete playlist
|--------------------------------------------------------------------------
*/
router.get('/:playlist/delete', validate.playlistExists, validate.playlistOwner, function (req, res, next) {
    // delete all invitations of that playlist before deleting the playlist
    inviteService.getInvitesOfPlaylist(req.user.email, req.params.playlist)
        .then(invites => {
            let promises = []

            invites.forEach(invite => { // we need the rev to delete from couchdb, no bulkDelete.. :(
                promises.push(inviteService.deleteInvite(invite))
            })

            Promise.all(promises)
                .then(values => {
                    next() // we ignore the result from delete (booleans)
                })
                .catch(next)
        })
        .catch(next)
}, function(req, res, next) {
    playlistService.deletePlaylist(req.playlist)
        .then(status => {
            res.redirectWithMessage('/playlists', 'The playlist was deleted with success!')
        })
        .catch(next)
})


/*
|--------------------------------------------------------------------------
| Playlist Share
|--------------------------------------------------------------------------
*/
router.get('/:playlist/share', validate.playlistExists, validate.playlistOwner, function (req, res, next) {
    inviteService.getInvitesOfPlaylist(req.user.email, req.params.playlist)
        .then(invites => {
            res.render('playlist/share', {
                title: "Share Playlist",
                playlist: req.playlist,
                invites: invites
            })
        })
        .catch(next)
})

router.post('/:playlist/share',
    validate.playlistExists,
    validate.playlistOwner,
    validate.shareUser,
    validate.duplicateInvitation, function (req, res, next) {
        let writable = !!req.body.write // if write field exists, writable is true, otherwise is false

        inviteService.sendInvitation(req.body.email, req.user.email, req.params.playlist, writable)
            .then(invite => {
                req.flash('Invitation to ' + req.body.email + " sent.")
                res.redirect('/playlists/' + req.params.playlist + '/share')
            })
            .catch(next)
    })


/*
|--------------------------------------------------------------------------
| Playlist Share Delete
|--------------------------------------------------------------------------
*/
router.get('/:playlist/share/:invite/delete',
    validate.playlistExists,
    validate.playlistOwner,
    validate.inviteExists,
    function (req, res, next) {
        inviteService.deleteInvite(req.invite)
            .then(ok => {
                res.redirectWithMessage(
                    '/playlists/' + req.params.playlist + '/share',
                    "Share revoked."
                )
            })
            .catch(next)
    })


/*
|--------------------------------------------------------------------------
| Playlist Share Edit Permissions
|--------------------------------------------------------------------------
*/
router.get('/:playlist/share/:invite/edit',
    validate.playlistExists,
    validate.playlistOwner,
    validate.inviteExists,
    function (req, res, next) {
        res.render('playlist/share-edit', {
            title: "Edit Permissions",
            playlist: req.playlist,
            invite: req.invite
        })
})

router.post('/:playlist/share/:invite/edit',
    validate.playlistExists,
    validate.playlistOwner,
    validate.inviteExists,
    function (req, res, next) {
        req.invite.writable = !!req.body.write

        inviteService.updateInvite(req.invite)
            .then(invite => {
                res.redirectWithMessage('/playlists/' + req.params.playlist + '/share', "Permissions updated.")
            })
            .catch(next)
    })






// to Ajax

/*
|--------------------------------------------------------------------------
| Edit playlist
|--------------------------------------------------------------------------
*/
router.get('/:playlist/edit', validate.playlistExists, validate.playlistOwner, function (req, res, next) {
    res.render('playlist/edit', {title: "Edit Playlist", playlist: req.playlist})
})

router.post('/:playlist/edit',
    validate.playlistExists,
    validate.playlistOwner,
    validate.playlistName,
    function (req, res, next) {
        req.playlist.name = req.body.name // update the object

        playlistService.updatePlaylist(req.playlist)
            .then(playlist => {
                res.redirectWithMessage('/playlists', playlist.name + ' edited with success!')
            })
            .catch(next)
})

/*
|--------------------------------------------------------------------------
| Remove playlist track
|--------------------------------------------------------------------------
*/
router.get('/:playlist/track/:track/remove',
    validate.playlistExists,
    validate.accessToPlaylist,
    validate.playlistWriteAccess,
    validate.trackExistsInPlaylist,
    function (req, res, next) {
        req.playlist.tracks.splice(req.trackIdx, 1) // remove the track from the playlist

        playlistService.updatePlaylist(req.playlist)
            .then(plist => {
                res.redirectWithMessage('back', 'Track removed with success!')
            })
            .catch(next)
})

/*
|--------------------------------------------------------------------------
| Playlist add track
|--------------------------------------------------------------------------
*/
router.post('/add-track',
    validate.playlistExists,
    validate.accessToPlaylist,
    validate.playlistWriteAccess,
    validate.trackNotExistsInPlaylist,
    function (req, res, next) {
        const trackId = req.body.track

        req.playlist.tracks.push(trackId)

        playlistService.updatePlaylist(req.playlist)
            .then(plist => {
                res.redirectWithMessage('back',
                    'Track added with success!'
                )
            })
            .catch(next)
})


module.exports = router;