const Factory = require('../../model/serviceFactory')

const playlistService = Factory.playlistService
const userService = Factory.userService
const inviteService = Factory.inviteService

/*
 |--------------------------------------------------------------------------
 | Validation middlewares for the Playlists routes
 |--------------------------------------------------------------------------
 */
/**
 * Validates if the playlist exists
 *
 * Requirements:
 * req.params.playlist or req.body.playlist (playlist id)
 * req.user (user obj, auth is needed)
 *
 * Fields added to the request:
 * req.playlist (if exists)
 *
 * @param req
 * @param res
 * @param next
 */
module.exports.playlistExists = function (req, res, next) {
    const playlistId = req.params.playlist || req.body.playlist

    playlistService.getPlaylistById(playlistId)
        .then(playlist => {

            if (!playlist) {
                return res.backWithError('No playlist found with that id!')
            }

            console.log(playlist);
            req.playlist = playlist
            next()
        })
        .catch(next)
}


/**
 * Validates the access to a playlist
 * That playlist can be owned by the user or an invite from other user
 * If it is an invited one, must be accepted first
 *
 * Requirements:
 * req.playlist (playlistExists middleware before)
 *
 * Fields added to the request:
 * req.playlist.invite (if is an invite)
 *
 * @param req
 * @param res
 * @param next
 */
module.exports.accessToPlaylist = function (req, res, next) {
    if (req.playlist.user_id == req.user.id) // the user is the owner of the playlist
        return next()

    // this playlist is not from the user, lets check if is an invited one
    inviteService.getInvitationByPlaylistAndUser(req.user.email, req.playlist.id)
        .then(invite => {

            if (!invite || invite.accepted == false) {
                return res.backWithError('You dont have access to that playlist!')
            }

            // its an invite, lets add that info
            req.playlist.invite = invite
            next()
        })
        .catch(next)
}


/**
 * Validates if the user is the owner of the playlist
 * This is usefull to perform actions to the playlist:
 * Update, Delete
 *
 * Requirements:
 * req.playlist (playlistExists middleware before)
 *
 * @param req
 * @param res
 * @param next
 */
module.exports.playlistOwner = function (req, res, next) {
    // the user is the owner of the playlist
    if (req.playlist.user_id == req.user.id)
        return next()

    return res.backWithError('You dont have access to that playlist!')
}


/**
 * Validate if an user has write access to that playlist
 * Has write access if is the owner or the invite has write permission
 *
 * Requirements:
 * req.playlist
 * req.user
 *
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
module.exports.playlistWriteAccess = function (req, res, next) {
    // the owner can do whatever he wants..
    if (req.playlist.user_id == req.user.id)
        return next()

    if (!req.playlist.invite) // is not an invite? something is wrong here..
        return res.backWithError('You cant write to this playlist..')

    if (!req.playlist.invite.writable) // we dont have write permissions?
        return res.backWithError('You dont have write access to that playlist!')

    // we have write permissions!
    next()
}


/**
 * Validate if the track exists in the playlist
 *
 * Requirements:
 * req.params.track or req.body.track (track id)
 * req.playlist
 *
 *
 * Fields added to the request:
 * req.trackIdx (track index on the tracks array of the playlist)
 *
 * @param req
 * @param res
 * @param next
 */
module.exports.trackExistsInPlaylist = function (req, res, next) {
    const trackId = req.params.track || req.body.track
    const trackIdx = req.playlist.tracks.indexOf(trackId)

    if (trackIdx === -1) {
        return res.backWithError('No track found with that id!')
    }

    req.trackIdx = trackIdx
    next()
}

/**
 * Validate if the track does not exists in the playlist
 *
 * Requirements:
 * req.params.track or req.body.track (track id)
 * req.playlist
 *
 * @param req
 * @param res
 * @param next
 */
module.exports.trackNotExistsInPlaylist = function (req, res, next) {
    const trackId = req.params.track || req.body.track
    const trackIdx = req.playlist.tracks.indexOf(trackId)

    if (trackIdx !== -1) { // found the track
        return res.backWithError('The track already exists in that playlist!')
    }

    // no track, we are cool..
    next()
}


/**
 * Validation Middleware for the name of the playlist
 * Can be used before create & edit of a playlist
 *
 * Requirements:
 * req.body.name (playlist name)
 * req.playlist (optional for update)
 *
 * @param req
 * @param res
 * @param next
 * @return {*}
 */
module.exports.playlistName = function (req, res, next) {
    const name = req.body.name

    if (!name) {
        return res.backWithError('A name must be provided')
    }

    if (typeof req.playlist !== "undefined") { // if present is an update!
        // same name? let's go back just because we dont need to update anything
        if (req.playlist.name == name) {
            return res.redirect('/playlists')
        }
    }

    // Playlists with the same name are not allowed.. is this really necessary?
    playlistService.findUserPlaylistByName(req.user.id, name)
        .then(pl => {

            if (pl) {
                return res.backWithError('A playlist with that name already exists!')
            }

            next()
        })
        .catch(next)
}


/**
 * Validate email field in body to see if the user exists
 * If exists, req.foundUser field is added
 *
 * Requirements:
 * req.body.email (user email)
 *
 * Fields added to the request:
 * req.foundUser (user found)
 *
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
module.exports.shareUser = function (req, res, next) {
    if (!req.body.email) {
        return res.backWithError('An email is necessary!')
    }

    if (req.body.email == req.user.email) {
        return res.backWithError('Nice try, share with someone else.')
    }

    userService.findByEmail(req.body.email)
        .then(user => {

            if (!user) {
                return res.backWithError('That user is not registered in our database!')
            }

            req.foundUser = user
            next()
        })
        .catch(next)
}


/**
 * Validate if the invitation to that user already exists
 * This prevents duplicate invitations
 *
 * Requirements:
 * req.body.email (user email)
 * req.params.playlist (playlist id)
 *
 * @param req
 * @param res
 * @param next
 */
module.exports.duplicateInvitation = function (req, res, next) {
    inviteService.getInvitation(req.body.email, req.user.email, req.params.playlist)
        .then(invite => {

            if (!invite) {
                return next()
            }

            return res.backWithError('You already sent an invitation to that user about that playlist!')
        })
        .catch(next)
}


/**
 * Validate the invite ID to see if exists and belongs to the authenticated user
 *
 * Requirements:
 * req.params.invite (invite id)
 *
 * Fields added to the request:
 * req.invite (if found)
 *
 * @param req
 * @param res
 * @param next
 */
module.exports.inviteExists = function (req, res, next) {
    inviteService.getInvitationById(req.params.invite)
        .then(invite => {

            if (!invite) {
                return res.backWithError('There is no invite with that id!')
            }

            if (invite.fromEmail != req.user.email) {
                return res.backWithError('That invitation isn\'t yours! :(')
            }

            req.invite = invite
            next()
        })
        .catch(next)
}
