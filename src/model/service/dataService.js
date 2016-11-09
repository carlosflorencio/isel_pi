"use strict";

const spotify = require('../../data/SpotifyRepository')
const mapper = require('./mapperService')

const methods = {}

// TODO: test this service

/**
 * Search Artist using spotify data
 * @param name
 * @param page
 * @param limit
 * @param cb
 */
methods.searchArtist = function(name, page, limit, cb) {
    spotify.searchArtist(name, getOffset(page, limit), limit, (err, spotifyJsonResponse) => {
        if(err || spotifyJsonResponse.json.error)
            return cb(err ? err : spotifyJsonResponse.json.error.message)

        cb(null, mapper.mapArtistsToCollection(spotifyJsonResponse.json))
    })
}

/**
 * Get Artist and his Albums
 * TODO: use ES6 promises!
 * @param id
 * @param page
 * @param limit
 * @param cb
 */
methods.getArtistInfoWithAlbums = function (id, page, limit, cb) {
    let count = 0, artist = null, albums = null

    spotify.getArtist(id, (err, spotifyJsonResponse) => {
        if(err || spotifyJsonResponse.json.error)
            return cb(err ? err : spotifyJsonResponse.json.error.message)

        artist = mapper.mapArtist(spotifyJsonResponse.json)

        if(++count == 2) {
            artist.albums = albums
            cb(null, artist)
        }
    })

    spotify.getArtistAlbums(id, getOffset(page, limit), limit, (err, spotifyJsonResponse) => {
        if(err || spotifyJsonResponse.json.error)
            return cb(err ? err : spotifyJsonResponse.json.error.message)

        albums = mapper.mapAlbumsToCollection(spotifyJsonResponse.json)

        if(++count == 2) {
            artist.albums = albums
            cb(null, artist)
        }
    })
}

/*
|--------------------------------------------------------------------------
| Utils
|--------------------------------------------------------------------------
*/
/**
 * Convert a page number and limit items to an offset
 * Spotify API uses an offset integer
 * @param page
 * @param limit
 * @return {number}
 */
function getOffset(page, limit) {
    if(page < 1) page = 1
    if(limit < 1) limit = 1
    if(limit > 20) limit = 20

    return --page * limit
}

module.exports = methods
