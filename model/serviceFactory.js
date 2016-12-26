// Cache service
const cacheService = require('./service/cacheService')

// Playlist service
const PlaylistDataService = require('./service/playlistService')
const playlistRepo = require('../data/PlaylistsRepository')
const playlistService = new PlaylistDataService(playlistRepo)

// Spotify service
const SpotifyDataService = require('./service/spotifyService')
const spotifyRepo = require('../data/SpotifyRepository')
const spotifyService = new SpotifyDataService(spotifyRepo)

// User service
const UserDataService = require('./service/userService')
const userRepo = require('../data/UsersRepository')
const userService = new UserDataService(userRepo)

// Invite service
const InviteDataService = require('./service/inviteService')
const inviteRepo = require('../data/InvitesRepository')
const inviteService = new InviteDataService(inviteRepo)

/*
|--------------------------------------------------------------------------
| Exports
|--------------------------------------------------------------------------
*/
module.exports.cacheService = (dir, ext = 'json') => {
    return new cacheService(dir, ext)
}

module.exports.playlistService = playlistService
module.exports.spotifyService = spotifyService
module.exports.userService = userService
module.exports.inviteService = inviteService

