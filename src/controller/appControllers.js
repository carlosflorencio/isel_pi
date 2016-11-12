"use strict";

const viewService = require('../model/service/viewService')
const dataService = require('../model/service/dataService')

const controllers = {}

/**
 * Home controller
 *
 * @param request
 * @param callback (err, viewString)
 */
controllers.home = function (request, callback) {
    callback(null, viewService.render('home', {title: "Homepage"}))
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
        return callback(new Error("No artist provided!")) // TODO: all errors should be new Error

    dataService.searchArtist(artist, page, limit, (err, collection) => {
        if (err)
            return callback(err)

        const data = {
            title: collection.total + " Results for " + artist,
            query: artist,
            collection: collection
        }

        callback(null, viewService.render('search', data))
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
        return callback("No artist id provided")

    dataService.getArtistInfoWithAlbums(id, page, limit, (err, artist) => {
        if (err)
            return callback(err)

        const data = {
            title: artist.name,
            artist: artist,
            id: artist.id
        }
        callback(null, viewService.render('artist', data));
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
        return callback("No album id provided")

    dataService.albumInfo(id, (err, album) => {
        if (err)
            return callback(err)

        const data = {
            title: album.name,
            album: album
        }

        callback(null, viewService.render('album', data))
    })
}

module.exports.controllers = controllers