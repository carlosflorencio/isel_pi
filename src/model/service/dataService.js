"use strict";

const spotify = require('../../data/SpotifyRepository')
const mapper = require('./mapperService')
const Artist = require('../entity/Artist')

const methods = {}

// TODO: test this service

/**
 * Search Artist using spotify data
 * @param name
 * @param offset
 * @param cb
 */
methods.searchArtist = function(name, offset, cb) {
    spotify.searchArtist(name, offset, (err, jsonResponse) => {
        if(err || jsonResponse.json.error)
            return cb(err ? err : jsonResponse.json.error.message)

        cb(null, mapper.artistsToCollection(jsonResponse.json))
    })
}

methods.getArtist = function (id, offset, cb) {
    var count = 0
    var artist = new Artist()

    spotify.getArtistAlbums(id, offset, (err, jsonResponse) => {
        if(err || jsonResponse.json.error) {
            return cb(err ? err : jsonResponse.json.error.message)
        }
        mapper.artist(artist, jsonResponse.json)
        if(++count == 2)
            cb(null, artist)
    })

    spotify.getArtist(id, offset, (err, jsonResponse) => {
        if(err || jsonResponse.json.error) {
            return cb(err ? err : jsonResponse.json.error.message)
        }
        mapper.artist(artist, jsonResponse.json)
        if(++count == 2)
            cb(null, artist)
    })
}

module.exports = methods
