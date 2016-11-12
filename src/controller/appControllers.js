"use strict";

const viewService = require('../model/service/viewService')
const DataService = require('../model/service/dataService')
const dataService = new DataService(require('../data/SpotifyRepository'))

const controllers = {}

/**
 * Home controller
 *
 * @param request
 * @param callback (err, viewString)
 */
controllers.home = function (request, callback) {
    viewService.render('home', {title: 'Homepage'}, callback)
}

/**
 * Artist search controller
 * Receives the Artist from the query string parameter q or in the path
 * ex: /artist or /?q=artist
 * Also looks for pagination parameters page and limit
 * ex: /artist?page=2&limit=10
 *
 * @param request
 * @param callback (err, viewString)
 */
controllers.search = function (request, callback) {
    const page = request.query.page || 1
    const limit = request.query.limit || 10
    const artist = request.query.q || request.params.id

    if (!artist)
        return callback(new Error("No artist provided!"))

    dataService.searchArtist(artist, page, limit, (err, collection) => {
        if (err)
            return callback(err)

        const data = {
            title: collection.total + " Results for " + artist,
            query: artist,
            collection: collection
        }

        viewService.render('search', data, callback)
    })
}

/**
 * Artists Controller
 * Shows all the artist info and his albums paginated
 * USES CACHE!
 *
 * @param request
 * @param callback
 * @return {*}
 */
controllers.artists = function (request, callback) {
    const page = request.query.page || 1
    const limit = request.query.limit || 5
    const id = request.query.q || request.params.artist

    if (!id)
        return callback(new Error("No artist id provided"))

    dataService.getArtistInfoWithAlbums(id, page, limit, (err, artist) => {
        if (err)
            return callback(err)

        const data = {
            title: artist.name,
            artist: artist,
            id: artist.id
        }
        viewService.render('artist', data, callback)
    })
}

/**
 * Album Controller
 * Shows the album info with tracks (not paginated! The first 50)
 *
 * @param request
 * @param callback
 * @return {*}
 */
controllers.album = function (request, callback) {
    const id = request.query.q || request.params.id

    if (!id)
        return callback(new Error("No album id provided"))

    dataService.albumInfo(id, (err, album) => {
        if (err)
            return callback(err)

        const data = {
            title: album.name,
            album: album
        }
        viewService.render('album', data, callback)
    })
}

module.exports.controllers = controllers