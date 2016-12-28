const express = require('express');
const router = express.Router();
const Factory = require('../model/serviceFactory')
const auth = require('connect-ensure-login').ensureAuthenticated

const inviteService = Factory.inviteService
const playlistService = Factory.playlistService

// All this routes need to be authenticated
router.use(auth('/user/login'))

/*
|--------------------------------------------------------------------------
| Invites Index
|--------------------------------------------------------------------------
*/
router.get('/', function(req, res, next) {
    //req.user.invites.map

    // playlistService.getMultiplePlaylists(ids, (err, playlists) => {
    //
    //
    // })

    res.render('invite/index', {
        title: 'Invites'
    });
});


module.exports = router;