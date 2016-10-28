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
    return new Collection(json.artists.offset, json.artists.limit, json.artists.total, artists)
}

/**
 * Maps json object to an Artist
 *
 * @param json json object
 */
function mapArtist(json){

}

module.exports.artistsToCollection = mapArtistsToCollection