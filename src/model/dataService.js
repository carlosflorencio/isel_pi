"use strict";

const spotify = require('../data/SpotifyRepository')
const Artist = require('./Artist')

const methods = {}

/**
 * Search Artist using spotify data
 * @param name
 * @param offset
 * @param cb
 */
methods.searchArtist = function(name, offset, cb) {
    spotify.searchArtist(name, offset, (err, json) => {
        if(err || json.error) {
            return cb(err ? err : json.error.message)
        }

        let artists = json.artists.items.map(function (item) {
            return new Artist(item.name)
        })

        console.log(artists);
        console.log(json.artists.items);

        cb(null, json)
    })
}

module.exports = methods
