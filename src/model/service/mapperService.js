"use strict";

const Artist = require('./../entity/Artist')
const Collection = require('../entity/Collection')
const Album = require('../entity/Album')

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

module.exports.artistsToCollection = mapArtistsToCollection
module.exports.artist = mapArtist
