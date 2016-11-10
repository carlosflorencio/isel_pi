"use strict";

const cacheService = require('../model/service/cacheService')
const dataService = require('../model/service/dataService')
const viewService = require('../model/service/viewService')

const controller = {}

/**
 * Gets the artist info view
 * Looks for it in the cache
 * If not in cache we will fetch the data from internet
 * @param id
 * @param page
 * @param limit
 * @param cb
 */
controller.getArtistInfoWithAlbums = function(id, page, limit, cb)  {
    const cacheViewName = id + '_' + page + '_' + limit

    cacheService.getCachedView(cacheViewName, (err, view) => {
        if(err) { // We dont have a view in cache
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


module.exports = controller