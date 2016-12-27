const express = require('express')
const router = express.Router()
const auth = require('connect-ensure-login').ensureAuthenticated
const Factory = require('../model/serviceFactory')

const playlistService = Factory.playlistService
const spotifyService = Factory.spotifyService
const userService = Factory.userService
const inviteService = Factory.inviteService

// All this routes need to be authenticated
router.use(auth('/user/login'))

/*
|--------------------------------------------------------------------------
| Playlists list
|--------------------------------------------------------------------------
*/
router.get('/', function (req, res, next) {
    res.render('playlist/index', {title: "Playlists"})
})

/*
|--------------------------------------------------------------------------
| Playlist details
|--------------------------------------------------------------------------
*/
router.get('/details/:playlist', validatePlaylist, function (req, res, next) {
    const playlist = req.user.playlists[req.playlistIdx]

    if(playlist.tracks.length == 0) {
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

router.post('/create', validatePlaylistName, function (req, res, next) {
    const name = req.body.name

    playlistService.createPlaylist(req.user._id, name, (err, playlist) => {
        if(err) return next(err)

        req.user.playlists.push(playlist)
        req.flash(playlist.name + ' playlist created!')
        res.redirect('/playlists')
    })
})

/*
|--------------------------------------------------------------------------
| Edit playlist
|--------------------------------------------------------------------------
*/
router.get('/:playlist/edit', validatePlaylist, function (req, res, next) {
    res.render('playlist/edit', {title: "Edit Playlist", playlist: req.user.playlists[req.playlistIdx]})
})

router.post('/:playlist/edit', validatePlaylist, validatePlaylistName, function (req, res, next) {
    req.user.playlists[req.playlistIdx].name = req.body.name

    playlistService.updatePlaylist(req.user.playlists[req.playlistIdx], (err, playlist) => {
        if(err) return next(err)

        req.flash(playlist.name + ' edited with success!')
        res.redirect('/playlists')
    })
})

/*
|--------------------------------------------------------------------------
| Delete playlist
|--------------------------------------------------------------------------
*/
router.get('/:playlist/delete', validatePlaylist, function (req, res, next) {
    playlistService.deletePlaylist(req.user.playlists[req.playlistIdx], (err, status) => {
        if(err) return next(err)

        delete req.user.playlists[req.playlistIdx]
        req.flash('Deleted the playlist with success!')
        res.redirect('/playlists')
    })
})



/*
|--------------------------------------------------------------------------
| Remove playlist track
|--------------------------------------------------------------------------
*/
router.get('/:playlist/remove/:track', validatePlaylist, validateTrack, function (req, res, next) {
    req.user.playlists[req.playlistIdx].tracks.splice(req.trackIdx, 1)

    playlistService.updatePlaylist(req.user.playlists[req.playlistIdx], (err, plist) => {
        if(err) return next(err)

        req.user.playlists[req.playlistIdx] = plist // update user session
        req.flash('Track removed with success!')
        res.redirect('back')
    })
})

/*
|--------------------------------------------------------------------------
| Playlist add track
|--------------------------------------------------------------------------
*/
router.post('/add', validatePlaylist, function (req, res, next) {
    const trackId = req.body.track

    const idx = req.user.playlists[req.playlistIdx].tracks.indexOf(trackId)

    if(idx !== -1) {
        req.flash('That track is already in the playlist!', 'danger')
        res.redirect('back')
        return
    }

    req.user.playlists[req.playlistIdx].tracks.push(trackId)

    playlistService.updatePlaylist(req.user.playlists[req.playlistIdx], (err, plist) => {
        if(err) return next(err)

        req.user.playlists[req.playlistIdx] = plist // update user session
        req.flash('Track added with success!')
        res.redirect('/playlists/details/' + req.user.playlists[req.playlistIdx].id)
    })
})


/*
|--------------------------------------------------------------------------
| Playlist Share
|--------------------------------------------------------------------------
*/
router.get('/:playlist/share', validatePlaylist, function (req, res, next) {

    inviteService.getInvitesOfPlaylist(req.user.email, req.params.playlist, (err, invites) => {
        if(err) return next(err)

        res.render('playlist/share', {
            title: "Share Playlist",
            playlist: req.user.playlists[req.playlistIdx],
            invites: invites
        })
    })
})

router.post('/:playlist/share', validatePlaylist, validateShareUser, validateDuplicateInvitation, function (req, res, next) {
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
router.get('/:playlist/share/:invite/delete', validatePlaylist, validateInvite, function (req, res, next) {

    inviteService.deleteInvite(req.invite, (err, ok) => {
        if(err) return next(err)

        req.flash("Share revoked.")
        res.redirect('/playlists/' + req.params.playlist + '/share')
    })
})

/*
|--------------------------------------------------------------------------
| Playlist Share Edit Permissions
|--------------------------------------------------------------------------
*/
router.get('/:playlist/share/:invite/edit', validatePlaylist, validateInvite, function (req, res, next) {

    res.render('playlist/share-edit', {
        title: "Edit Permissions",
        playlist: req.user.playlists[req.playlistIdx],
        invite: req.invite
    })
})

router.post('/:playlist/share/:invite/edit', validatePlaylist, validateInvite, function (req, res, next) {
    req.invite.writable = !!req.body.write

    inviteService.updateInvite(req.invite, (err, invite) => {
        if(err) return next(err)

        console.log(invite);

        req.flash("Permissions updated.")
        res.redirect('/playlists/' + req.params.playlist + '/share')
    })
})





/*
|--------------------------------------------------------------------------
| Validation middlewares
|--------------------------------------------------------------------------
*/
/**
 * Validate playlist id middleware
 *
 * Add the playlist idx to the req
 * @param req
 * @param res
 * @param next
 */
function validatePlaylist(req, res, next) {
    const playlistId = req.params.playlist || req.body.playlist

    const playlistIdx = req.user.playlists.findIndex(p => p.id == playlistId)

    if(playlistIdx === -1) {
        req.flash('No playlist found with that id!', 'danger')
        res.redirect('back') // no playlist found
        return
    }

    req.playlistIdx = playlistIdx
    next()
}

/**
 * Validate track middleware
 * Need to be called after the validatePlaylist middleware
 *
 * Add the trackIdx to the req
 * @param req
 * @param res
 * @param next
 */
function validateTrack(req, res, next) {
    const trackId = req.params.track || req.body.track
    const trackIdx = req.user.playlists[req.playlistIdx].tracks.indexOf(trackId)

    if(trackIdx === -1) {
        req.flash('No track found with that id!', 'danger')
        res.redirect('back')
        return
    }

    req.trackIdx = trackIdx
    next()
}

/**
 * Validation Middleware for the name of the playlist
 * Can be used before create & edit of a playlist
 * Should be used after the validatePlaylist
 * @param req
 * @param res
 * @param next
 * @return {*}
 */
function validatePlaylistName(req, res, next) {
    const name = req.body.name

    if(!name) {
        req.flash('A name must be provided', 'danger')
        return res.redirect('back')
    }

    if(typeof req.playlistIdx !== "undefined") { // update?
        // same name? let's go back just because we dont need to update anything
        if(req.user.playlists[req.playlistIdx].name == name) {
            return res.redirect('/playlists')
        }
    }

    playlistService.findUserPlaylistByName(req.user._id, name, (err, pl) => {
        if(err) return next(err)

        if(pl) {
            req.flash('A playlist with that name already exists!', 'danger')
            return res.redirect('back')
        }

        next()
    })
}

/**
 * Validate email field in body to see if the user exists
 * If exists, req.foundUser field is added
 *
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
function validateShareUser(req, res, next) {
    if(!req.body.email) {
        req.flash('An email is necessary!', 'danger')
        return res.redirect('back')
    }

    if(req.body.email == req.user.email) {
        req.flash('Nice try, share with someone else.', 'danger')
        return res.redirect('back')
    }

    userService.findByEmail(req.body.email, (err, user) => {
        if(err) return next(err)

        if(!user) {
            req.flash('That user is not registered in our database!', 'danger')
            return res.redirect('back')
        }

        req.foundUser = user
        next()
    })
}

/**
 * Validate if the invitation already exists in db
 *
 * @param req
 * @param res
 * @param next
 */
function validateDuplicateInvitation(req, res, next) {
    inviteService.getInvitation(req.body.email, req.user.email, req.params.playlist, (err, invite) => {
        if(err) return next(err)

        if(!invite) {
            return next()
        }

        req.flash('You already sent an invitation to that user about that playlist!', 'danger')
        res.redirect('back')
    })
}

/**
 * Validate the invite ID to see if exists and belongs to the authenticated user
 * Invite is added to req.invite
 *
 * @param req
 * @param res
 * @param next
 */
function validateInvite(req, res, next) {
    inviteService.getInvitationById(req.params.invite, (err, invite) => {
        if(err) return next(err)

        if(!invite) {
            req.flash('There is no invite with that id!', 'danger')
            return res.redirect('back')
        }

        if(invite.fromEmail != req.user.email) {
            req.flash('That invitation isn\'t yours! :(', 'danger')
            return res.redirect('back')
        }

        req.invite = invite
        next()
    })
}

module.exports = router;