"use strict";

const spotify = require('../../data/SpotifyRepository')
const mapper = require('./mapperService')

const dataService = {}

// TODO: test this service

/**
 * Search Artist using spotify data
 * @param name
 * @param page
 * @param limit
 * @param cb
 */
dataService.searchArtist = function(name, page, limit, cb) {
    spotify.searchArtist(name, getOffset(page, limit), limit, (err, spotifyJsonResponse) => {
        if(err || spotifyJsonResponse.json.error)
            return cb(err ? err : spotifyJsonResponse.json.error.message)

        const collection = mapper.mapArtistsToCollection(spotifyJsonResponse.json)
        collection.expire = spotifyJsonResponse.lifetime // TODO: remove this hack

        cb(null, collection)
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
dataService.getArtistInfoWithAlbums = function (id, page, limit, cb) {
    let count = 0, artist = null, albums = null
    //TODO: change this to paralel get

    //spotify.getArtistInfo(id, page, limit, (err, arrayResponses) => {
    //    arrayResponses[0] -> ArtistJson (SpotifyResponse)
    //    arrayResponses[1] -> ArtistAlbums (SpotifyResponse)
    // mapper
    //})

    spotify.getArtist(id, (err, spotifyJsonResponse) => {
        if(err || spotifyJsonResponse.json.error)
            return cb(err ? err : spotifyJsonResponse.json.error.message)

        artist = mapper.mapArtist(spotifyJsonResponse.json)
        artist.expire = spotifyJsonResponse.lifetime // TODO: remove this hack

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
            if(spotifyJsonResponse.lifetime < artist.expire ) // TODO: remove this hack
                artist.expire = spotifyJsonResponse.lifetime

            cb(null, artist)
        }
    })
}

/**
 * Get an album info with tracks
 * @param id
 * @param cb
 */
dataService.albumInfo = function(id, cb) {
    spotify.getAlbumInfo(id, (err, spotifyJsonResponse) => {
        if(err || spotifyJsonResponse.json.error)
            return cb(err ? err : spotifyJsonResponse.json.error.message)

        const album = mapper.mapAlbum(spotifyJsonResponse.json)
        album.expire = spotifyJsonResponse.lifetime // TODO: remove this hack

        cb(null, album)
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

module.exports = dataService
