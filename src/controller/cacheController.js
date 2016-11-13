"use strict";

const cacheService = require('../model/service/cacheService')

const appController = require('./appControllers')

const viewService = require('../model/service/viewService')
const DataService = require('../model/service/dataService')
const dataService = new DataService(require('../data/SpotifyRepository'))

const controllers = {}

/**
 * Home cache controller
 *
 * Cache not implemented. Redirects to appController
 *
 * @param request
 * @param callback (err, viewString)
 */
controllers.home = function (request, callback) {
    return appController.controllers.home(request, callback)
}

/**
 * Artist search cache controller
 * Receives the Artist from the query string parameter q or in the path
 * ex: /artist or /?q=artist
 * Also looks for pagination parameters page and limit
 * ex: /artist?page=2&limit=10
 *
 * Cache not implemented. Redirects to appController
 *
 * @param request
 * @param callback (err, viewString)
 */
controllers.search = function (request, callback) {
    return appController.controllers.search(request, callback)
}

/**
 * Artists cache controller
 * Shows all the artist info and his albums paginated
 *
 * Gets the artist info view
 * Looks for it in the cache
 * If not in cache it will fetch the data from the internet
 *
 * @param request
 * @param cb
 * @return {*}
 */
controllers.artists = function (request, cb) {
    const page = request.query.page || 1
    const limit = request.query.limit || 5
    const id = request.query.q || request.params.artist

    if (!id)
        return cb(new Error("No artist id provided"))

    const cacheViewName = id + '_' + page + '_' + limit

    cacheService.getCachedView(cacheViewName, (err, cachedView) => {
        if(err) { // We dont have a view in cache
            dataService.getArtistInfoWithAlbums(id, page, limit, (err, artist) => {
                if (err)
                    return cb(err)

                const data = {
                    title: artist.name,
                    artist: artist,
                    id: id
                }

                viewService.render('artist', data, (err, renderedView) => {
                    if(err)
                        return cb(err)

                    cacheService.addCachedView(cacheViewName, renderedView, artist.expire)
                    cb(null, renderedView);
                })
            })
        } else {
            cb(null, cachedView) // Cached view!
        }
    })
}

/**
 * Album cache controller
 * Shows the album info with tracks (not paginated! The first 50)
 *
 * Cache not implemented. Redirects to appController
 *
 * @param request
 * @param callback
 * @return {*}
 */
controllers.album = function (request, callback) {
    return appController.controllers.album(request, callback)
}


module.exports.controllers = controllers