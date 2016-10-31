"use strict";

const Artist = require('./../entity/Artist')
const Collection = require('../entity/Collection')

/**
 * Maps json object to a collection of Artists
 *
 * @param json json object
 */
function mapArtistsToCollection(json) {
    let artists = json.artists.items.map(function (item) {
        // Spotify images array have 3 ou 0 items

        return new Artist(
            item.id,
            item.name,
            item.images,
            item.genres.slice(), // duplicate array
            item.popularity,
            item.type,
            item.uri,
            item.followers.total
        )
    })
    return new Collection(json.artists.offset, json.artists.limit, json.artists.total, artists)
}

/**
 * Maps json object to an Artist
 *
 * @param json json object
 */
function mapArtist(json){
    return new Artist(
        json.id,
        json.name,
        json.images,
        json.genres,
        json.popularity,
        json.type,
        json.uri,
        json.followers.total
    )
}

function getSmallerImage(images){
    return images.length > 0 ? images[images.length-1] : null
}

module.exports.artistsToCollection = mapArtistsToCollection
module.exports.artist = mapArtist
