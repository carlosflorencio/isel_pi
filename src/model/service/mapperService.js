"use strict";

const Artist = require('./../entity/Artist')
const Collection = require('../entity/Collection')
const config = require('../../config.json')
const Album = require('../entity/Album')

// TODO: test this service

const exports = {}

/**
 * Maps spotify search artists json object to a collection of Artists
 *
 * @param json Artists Search Json
 */
exports.mapArtistsToCollection = function(json) {
    let artists = json.artists.items.map(artist => this.mapArtist(artist))

    return new Collection(
        json.artists.offset,
        json.artists.limit,
        json.artists.total,
        artists)
}

/**
 * Maps spotify albuns json object to a collection of Albuns
 *
 * TODO: refactor this? is the same as mapArtistsToCollection
 * @param albunsJson
 * @return {Collection}
 */
exports.mapAlbumsToCollection = function(albunsJson) {
    let albums = albunsJson.items.map(album => this.mapAlbum(album))

    return new Collection(albunsJson.offset,
        albunsJson.limit,
        albunsJson.total,
        albums)
}

/**
 * Maps the artist json and his albuns to an Artist Entity with a colection of
 * albuns in the albuns property
 * @param artistJson
 * @param albunsJson
 * @return {Artist}
 */
exports.mapArtistAndAlbuns = function(artistJson, albunsJson) {
    let artist = this.mapArtist(artistJson)
    artist.albums = this.mapAlbumsToCollection(albunsJson)

    return artist
}

/**
 * Maps a json artist item to an Artist Entity without albuns
 * @param jsonArtistItem
 * @return {Artist}
 */
exports.mapArtist = function(jsonArtistItem) {
    return new Artist(
        jsonArtistItem.id,
        jsonArtistItem.name,
        getImageFromJsonArray(jsonArtistItem.images, 'img/defaultAvatar.png'),
        jsonArtistItem.genres.slice(), // duplicate array
        jsonArtistItem.popularity,
        jsonArtistItem.type,
        jsonArtistItem.uri,
        jsonArtistItem.followers.total
    )
}

/**
 * Maps a json artist item to an Artist Entity without albuns
 * @param jsonAlbumItem
 * @return {Album}
 */
exports.mapAlbum = function(jsonAlbumItem) {
    return new Album(
        jsonAlbumItem.id,
        jsonAlbumItem.name,
        jsonAlbumItem.uri,
        getImageFromJsonArray(jsonAlbumItem.images, 'img/defaultAvatar.png'),
        jsonAlbumItem.type
    )
}

/*
 |--------------------------------------------------------------------------
 | Helpers
 |--------------------------------------------------------------------------
 */
/**
 * Gets the image of the wanted size from the images array
 * Spotify images sizes: 64px, 200px, 300px, 640px, 1000px
 *
 * @param images
 * @param preferenceSizesArray [200, 300] example, 300px as a fallback if there is no 200px image
 * @param imgDefault
 * @return {string}
 */
function getImageFromJsonArray(images, imgDefault = null,
                               preferenceSizesArray = [200, 300, 640, 64, 1000]) {
    const size = images.length
    if (size == 0)
        return config.base_url + ':' + config.port + '/' + imgDefault

    // Find the image for each of the preferences sizes
    for (let i = 0; i < preferenceSizesArray.length; i++) {
        let img = images.find(img => img.width == preferenceSizesArray[i])

        if (img) return img.url
    }

    // If none of the prefered sizes was found, lets return the first one
    return images[0].url
}

module.exports = exports
