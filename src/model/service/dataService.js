"use strict";

const spotify = require('../../data/SpotifyRepository')
const mapper = require('./mapperService')

const methods = {}

/**
 * Search Artist using spotify data
 * @param name
 * @param offset
 * @param cb
 */
methods.searchArtist = function(name, offset, cb) {
    spotify.searchArtist(name, offset, (err, jsonResponse) => {
        if(err || jsonResponse.json.error) {
            return cb(err ? err : jsonResponse.json.error.message)
        }
        cb(null, mapper.artistsToCollection(jsonResponse.json))
    })
}

methods.getArtist = function (id, offset, cb) {
    spotify.getArtist(id, offset, (err, jsonResponse) => {
        if(err || jsonResponse.json.error) {
            return cb(err ? err : jsonResponse.json.error.message)
        }
        cb(null, mapper.artist(jsonResponse.json))
    })
}

module.exports = methods
