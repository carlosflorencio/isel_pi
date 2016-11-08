"use strict";

const Artist = require('./../entity/Artist')
const Collection = require('../entity/Collection')
const config = require('../../config.json')
const Album = require('../entity/Album')

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

function mapAlbumsToCollection(json){
    let albums = json.items.map(function (item) {
        // Spotify images array have 3 ou 0 items

        return new Album(
            item.id,
            item.name,
            item.uri,
            item.images,
            item.type
        )
    })
    return new Collection(json.offset, json.limit, json.total, albums)
}

/**
 * Maps json object to an Artist
 *
 * @param json json object
 */
function mapArtist(artist, json){
    if(json.items){
        artist.albums = mapAlbumsToCollection(json)
        return artist
    }

    artist.id = json.id
    artist.name = json.name
    artist.images = json.images
    artist.genres = json.genres
    artist.popularity = json.popularity
    artist.type = json.type
    artist.uri = json.uri
    artist.followers = json.followers.total
    return artist
}

function getSmallerImage(images){
    return images.length > 0 ? images[images.length-1] : null
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
module.exports.artist = mapArtist
