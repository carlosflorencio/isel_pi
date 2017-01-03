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
 * Validates if the invite exists
 *
 * Requirements:
 * req.params.invite (invite id)
 * req.user (user obj, auth is needed)
 *
 * Fields added to the request:
 * req.invite (if exists)
 *
 * @param req
 * @param res
 * @param next
 */
module.exports.inviteExists = function (req, res, next) {
    const inviteId = req.params.invite

    inviteService.getInvitationById(inviteId)
        .then(invite => {

            if (!invite) {
                return res.backWithError('No invite found with that id!')
            }

            req.invite = invite
            next()
        })
        .catch(next)
}


/**
 * Validates if the current user is the receiver for the invite
 *
 * Requirements:
 * req.invite (invite obj)
 *
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
module.exports.inviteReceiver = function (req, res, next) {
    if(req.invite.toEmail == req.user.email)
        return next()

    return res.backWithError('You are not the receiver of that invite!')
}