"use strict";

const spotify = require('../data/SpotifyRepository')
const Artist = require('./Artist')
const Colection = require('./Colection')

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
            // Spotify images array have 3 ou 0 items
            const image = item.images.length == 3 ? item.images[1].url : null

            return new Artist(
                item.id,
                item.name,
                image,
                item.genres.slice(), // duplicate array
                item.popularity,
                item.type,
                item.uri,
                item.followers.total
            )
        })

        cb(null, new Colection(json.artists.offset, json.artists.limit, json.artists.total, artists))
    })
}

module.exports = methods
