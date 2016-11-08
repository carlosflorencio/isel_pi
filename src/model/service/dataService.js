"use strict";

const spotify = require('../../data/SpotifyRepository')
const mapper = require('./mapperService')
const Artist = require('../entity/Artist')

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
    spotify.searchArtist(name, getOffset(page, limit), limit, (err, jsonResponse) => {
        if(err || jsonResponse.json.error)
            return cb(err ? err : jsonResponse.json.error.message)

        cb(null, mapper.mapArtistsToCollection(jsonResponse.json))
    })
}

methods.getArtist = function (id, offset, cb) {
    //var count = 0
    //var artist = new Artist()
    //
    //spotify.getArtistAlbums(id, offset, (err, jsonResponse) => {
    //    if(err || jsonResponse.json.error) {
    //        return cb(err ? err : jsonResponse.json.error.message)
    //    }
    //    mapper.mapArtistAndAlbuns(artist, jsonResponse.json)
    //    if(++count == 2)
    //        cb(null, artist)
    //})
    //
    //spotify.getArtist(id, offset, (err, jsonResponse) => {
    //    if(err || jsonResponse.json.error) {
    //        return cb(err ? err : jsonResponse.json.error.message)
    //    }
    //    mapper.mapArtist(artist, jsonResponse.json)
    //    if(++count == 2)
    //        cb(null, artist)
    //})
}

/*
|--------------------------------------------------------------------------
| Utils
|--------------------------------------------------------------------------
*/
function getOffset(page, limit) {
    if(page < 1) page = 1
    if(limit < 1) limit = 1
    if(limit > 20) limit = 20

    return --page * limit
}

module.exports = methods
