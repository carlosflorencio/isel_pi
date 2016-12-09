const express = require('express')
const router = express.Router()
const auth = require('connect-ensure-login').ensureAuthenticated

const PlaylistDataService = require('../model/service/playlistService')
const playlistService = new PlaylistDataService(require('../data/PlaylistsRepository'))

const SpotifyDataService = require('../model/service/spotifyService')
const spotifyService = new SpotifyDataService(require('../data/SpotifyRepository'))

/*
|--------------------------------------------------------------------------
| Playlists list
|--------------------------------------------------------------------------
*/
router.get('/', auth('/user/login'), function (req, res, next) {
    res.render('playlist/index', {title: "Playlists"})
})

/*
|--------------------------------------------------------------------------
| Playlist details
|--------------------------------------------------------------------------
*/
router.get('/:id', auth('/user/login'), function (req, res, next) {
    const playlist = req.user.playlists.find(p => p.id == req.params.id)

    if(!playlist) {
        req.flash('No playlist found with that id!')
        return res.redirect('/playlists') // no playlist found
    }

    spotifyService.getTracks(playlist.tracks, (err, tracks) => {
        if(err) return next(err)

        res.render('playlist/details', {title: playlist.name, playlist: playlist, tracks: tracks})
    })
})

/*
|--------------------------------------------------------------------------
| Remove playlist track
|--------------------------------------------------------------------------
*/
router.get('/:id/remove/:track', auth('/user/login'), function (req, res, next) {
    const playlistIdx = req.user.playlists.findIndex(p => p.id == req.params.id)

    if(playlistIdx === -1) {
        req.flash('No playlist found with that id!')
        return res.redirect('/playlists') // no playlist found
    }

    const trackIdx = req.user.playlists[playlistIdx].tracks.indexOf(req.params.track)

    if(trackIdx === -1) {
        req.flash('No track found with that id!')
        return res.redirect('back')
    }

    // remove track
    req.user.playlists[playlistIdx].tracks.splice(trackIdx, 1);

    playlistService.updatePlaylist(req.user.playlists[playlistIdx], (err, plist) => {
        if(err) return next(err)

        req.user.playlists[playlistIdx] = plist // update user session
        req.flash('Track removed with success!', 'success')
        res.redirect('back')
    })
})

/*
|--------------------------------------------------------------------------
| Playlist add track
|--------------------------------------------------------------------------
*/
router.get('/:id/remove/:track', auth('/user/login'), function (req, res, next) {

})

module.exports = router;