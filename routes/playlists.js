const express = require('express')
const router = express.Router()
const auth = require('connect-ensure-login').ensureAuthenticated
const Factory = require('../model/serviceFactory')
const validate = require('./validation/playlistsValidation')

const playlistService = Factory.playlistService
const spotifyService = Factory.spotifyService
const inviteService = Factory.inviteService

// All this routes need to be authenticated
router.use(auth('/user/login'))


/*
|--------------------------------------------------------------------------
| Playlists list
|--------------------------------------------------------------------------
*/
router.get('/', function (req, res, next) {
    playlistService.playlistsOfUser(req.user.id, (err, playlists) => {
        if(err) return cb(err)

        res.render('playlist/index', {
            title: "Playlists",
            playlists: playlists
        })
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

    spotifyService.getTracks(playlist.tracks, (err, tracks) => {
        if(err) return next(err)

        res.render('playlist/details', {title: playlist.name, playlist: playlist, tracks: tracks})
    })
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

    playlistService.createPlaylist(req.user.id, name, (err, playlist) => {
        if(err) return next(err)

        res.redirectWithMessage('/playlists', playlist.name + ' playlist created!')
    })
})


/*
|--------------------------------------------------------------------------
| Delete playlist
|--------------------------------------------------------------------------
*/
router.get('/:playlist/delete', validate.playlistExists, validate.playlistOwner, function (req, res, next) {
    // delete all invitations of that playlist before deleting the playlist
    inviteService.getInvitesOfPlaylist(req.user.email, req.params.playlist, (err, invites) => {
        if(err) return next(err)

        let count = 0
        const total = invites.length

        invites.forEach(invite => { // we need the rev to delete from couchdb, no bulkDelete.. :(
            inviteService.deleteInvite(invite, (err, ok) => { // ok should be good
                if(err) return next(err)

                if(++count >= total) { // all deleted, delete the playlist!
                    next()
                }
            })
        })

        if(total == 0) next()
    })
}, function(req, res, next) {
    playlistService.deletePlaylist(req.playlist, (err, status) => {
        if(err) return next(err)

        res.redirectWithMessage('/playlists', 'The playlist was deleted with success!')
    })
})


/*
|--------------------------------------------------------------------------
| Playlist Share
|--------------------------------------------------------------------------
*/
router.get('/:playlist/share', validate.playlistExists, validate.playlistOwner, function (req, res, next) {

    inviteService.getInvitesOfPlaylist(req.user.email, req.params.playlist, (err, invites) => {
        if(err) return next(err)

        res.render('playlist/share', {
            title: "Share Playlist",
            playlist: req.playlist,
            invites: invites
        })
    })
})

router.post('/:playlist/share',
    validate.playlistExists,
    validate.playlistOwner,
    validate.shareUser,
    validate.duplicateInvitation, function (req, res, next) {
    let writable = !!req.body.write // if write field exists, writable is true, otherwise is false

    inviteService.sendInvitation(req.body.email, req.user, req.params.playlist, writable, (err, invite) => {
        if(err) return next(err)

        req.flash('Invitation to ' + req.body.email + " sent.")
        res.redirect('/playlists/' + req.params.playlist + '/share')
    })
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
        inviteService.deleteInvite(req.invite, (err, ok) => {
            if (err) return next(err)

            res.redirectWithMessage(
                '/playlists/' + req.params.playlist + '/share',
                "Share revoked."
            )
        })
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

        inviteService.updateInvite(req.invite, (err, invite) => {
            if (err) return next(err)

            res.redirectWithMessage('/playlists/' + req.params.playlist + '/share', "Permissions updated.")
        })
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

        playlistService.updatePlaylist(req.playlist, (err, playlist) => {
            if(err) return next(err)

            res.redirectWithMessage('/playlists', playlist.name + ' edited with success!')
        })
})

/*
|--------------------------------------------------------------------------
| Remove playlist track
|--------------------------------------------------------------------------
*/
router.get('/:playlist/remove/:track',
    validate.playlistExists,
    validate.accessToPlaylist,
    validate.playlistWriteAccess,
    validate.trackExistsInPlaylist,
    function (req, res, next) {
        req.playlist.tracks.splice(req.trackIdx, 1) // remove the track from the playlist

        playlistService.updatePlaylist(req.playlist, (err, plist) => {
            if(err) return next(err)

            res.redirectWithMessage('back', 'Track removed with success!')
        })
})

/*
|--------------------------------------------------------------------------
| Playlist add track
|--------------------------------------------------------------------------
*/
router.post('/add',
    validate.playlistExists,
    validate.accessToPlaylist,
    validate.playlistWriteAccess,
    validate.trackNotExistsInPlaylist,
    function (req, res, next) {
        const trackId = req.body.track

        req.playlist.tracks.push(trackId)

        playlistService.updatePlaylist(req.playlist, (err, plist) => {
            if(err) return next(err)

            res.redirectWithMessage(
                '/playlists/details/' + req.playlist.id,
                'Track added with success!'
            )
        })
})


module.exports = router;