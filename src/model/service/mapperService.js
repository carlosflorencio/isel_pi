"use strict";

const Artist = require('./../entity/Artist')
const Collection = require('../entity/Collection')
const config = require('../../config.json')

/**
 * Maps json object to a collection of Artists
 *
 * @param json json object
 */
function mapArtistsToCollection(json) {
    let artists = json.artists.items.map(function (item) {

        return new Artist(
            item.id,
            item.name,
            getImageFromJsonArray(item.images, 'img/defaultAvatar.png'),
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

/*
|--------------------------------------------------------------------------
| Helpers
|--------------------------------------------------------------------------
*/
function getImageFromJsonArray(images, imgDefault = null) {
    const size = images.length
    if(size == 0)
        return config.base_url + ':' + config.port + '/' + imgDefault

    // Get the image with 200px
    let res = images.filter(img => img.width == 200)

    return res.length == 1 ? res[0].url : images[0].url
}

module.exports.artistsToCollection = mapArtistsToCollection