// Cache service
const cacheService = require('./cacheService')

// Playlist service
const PlaylistDataService = require('./playlistService')
const playlistRepo = require('../../data/PlaylistsRepository')
const playlistService = new PlaylistDataService(playlistRepo)

// Spotify service
const SpotifyDataService = require('./spotifyService')
const spotifyRepo = require('../../data/SpotifyRepository')
const spotifyService = new SpotifyDataService(spotifyRepo)

// User service
const UserDataService = require('./userService')
const userRepo = require('../../data/UsersRepository')
const userService = new UserDataService(userRepo)

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
