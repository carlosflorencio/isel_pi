"use strict";

const cacheService = require('../model/service/cacheService')
const dataService = require('../model/service/dataService')
const viewService = require('../model/service/viewService')

const appController = require('./appControllers')

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
 * @param request
 * @param callback
 * @return {*}
 */
controllers.artists = function (request, callback) {
    getArtistInfoWithAlbums(
        request.query.q || request.params.q,
        request.query.page || 1,
        request.query.limit || 10,
        callback)
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

/**
 * Gets the artist info view
 * Looks for it in the cache
 * If not in cache we will fetch the data from internet
 *
 * @param id
 * @param page
 * @param limit
 * @param cb
 */
function getArtistInfoWithAlbums(id, page, limit, cb)  {
    const cacheViewName = id + '_' + page + '_' + limit

    cacheService.getCachedView(cacheViewName, (err, view) => {
        if(err) { // We dont have a view in cache
            //TODO: appController.artist();
            dataService.getArtistInfoWithAlbums(id, page, limit, (err, artist) => {
                if (err)
                    return cb(err)

                const data = {
                    title: artist.name,
                    artist: artist,
                    id: id
                }

                const renderedView = viewService.render('artist', data)
                cacheService.addCachedView(cacheViewName, renderedView, artist.expire)

                cb(null, renderedView);
            })
        } else {
            cb(null, view) // Cached view!
        }
    })
}


module.exports.controllers = controllers