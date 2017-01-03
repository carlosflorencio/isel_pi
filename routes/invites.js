const express = require('express');
const router = express.Router();
const Factory = require('../model/serviceFactory')
const auth = require('connect-ensure-login').ensureAuthenticated

const inviteService = Factory.inviteService
const playlistService = Factory.playlistService

const validate = require('./validation/invitesValidation')

// All this routes need to be authenticated
router.use(auth('/user/login'))

/*
|--------------------------------------------------------------------------
| Invites Index
|--------------------------------------------------------------------------
*/
router.get('/', function(req, res, next) {
    inviteService.getPendingInvitations(req.user.email)
        .then(invites => {

            if(invites.length == 0)
                return res.render('invite/index', { title: 'Invites', invites: [] });

            // we have invites, we have to fetch the playlists objects
            playlistService.getMultiplePlaylists(invites.map(i => i.playlistId))
                .then(playlists => {
                    for (let i = 0; i < invites.length; i++) { // append playlist object to invite
                        invites[i].playlist = playlists[i]
                    }

                    res.render('invite/index', {
                        title: 'Invites',
                        invites: invites
                    });
                })
                .catch(next)
        })
        .catch(next)
});

/*
|--------------------------------------------------------------------------
| Invites Accept & Reject
|--------------------------------------------------------------------------
*/
router.get('/:invite/accept', validate.inviteExists, validate.inviteReceiver, function(req, res, next) {
    req.invite.accepted = true

    inviteService.updateInvite(req.invite)
        .then(invite => {
            res.redirectWithMessage('/playlists/details/' + invite.playlistId,
                'Invite accepted! You can see the playlist now.')
        })
        .catch(next)
});

router.get('/:invite/reject', validate.inviteExists, validate.inviteReceiver, function(req, res, next) {
    inviteService.deleteInvite(req.invite)
        .then(ok => {
            res.redirectWithMessage('back', 'Invite rejected.')
        })
        .catch(next)
});

module.exports = router;