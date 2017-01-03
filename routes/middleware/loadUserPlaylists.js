const Factory = require('../../model/serviceFactory')

const playlistService = Factory.playlistService
const inviteService = Factory.inviteService


/**
 * Load all user playlists and invited playlists (accepted) to the request
 * Playlists that are invited have a property invite
 * Auth is needed
 *
 * Adds these fields:
 * - req.playlists
 * - req.invitedPlaylists (array of playlist objs with .invite property)
 *
 *
 * @param req
 * @param res
 * @param next
 */
module.exports = function (req, res, next) {
    if(!req.user) return next()

    const playlistsPromise = playlistService.playlistsOfUser(req.user.id),
          invitesPromise = inviteService.getInvitations(req.user.email)

    Promise
        .all([playlistsPromise, invitesPromise]) // parallel fetch
        .then(results => {
            let userPlaylists = results[0]
            let invites = results[1].filter(i => i.accepted) // We only want the accepted invites

            req.playlists = userPlaylists //save user playlists
            req.invitedPlaylists = []

            if(invites.length == 0) { // we dont have invites
                return next()
            }

            // we have invites, we have to fetch those playlists
            playlistService.getMultiplePlaylists(invites.map(i => i.playlistId))
                .then(playlists => {
                    for (let i = 0; i < playlists.length; i++) {
                        playlists[i].invite = invites[i] // add invite property to invited playlists
                    }

                    req.invitedPlaylists = playlists //save invited playlists
                    next()
                })
                .catch(next)
        })
        .catch(next)
}