"use strict";

const viewService = require('../model/service/viewService')
const dataService = require('../model/service/dataService')
const utils = require('../Utils')
const cacheController = require('../controller/cacheController')

const controllers = {}

/**
 * Home controller
 * @param request
 * @param callback (err, viewString)
 */
controllers.home = function (request, callback) {
    callback(null, viewService.render('home', {title: "Homepage"}))
}

/**
 * Artist search
 * @param request
 * @param callback (err, viewString)
 */
controllers.search = function (request, callback) {
    const params = utils.getParameters(request.url)
    const page = params.page || 1
    const limit = params.limit || 10
    const artist = params.q || decodeURIComponent(utils.getPathname(request.url).split('/')[2])

    if (!artist)
        return callback("No artist provided!")

    dataService.searchArtist(artist, page, limit, (err, collection) => {
        if (err)
            return callback(err)

        collection.query = artist
        collection.title = collection.total + " Results for " + artist

        callback(null, viewService.render('search', collection))
    })

}

controllers.artists = function (request, callback) {
    const pathname = utils.getPathname(request.url)
    const id = pathname.split('/')[2]
    const offset = 0

    if(!id)
        return callback("No artist id provided")

    cacheController.fetchArtist(id, offset, (err, view) => {
        if(err)
           return callback(err)

        if(view == null) {
            dataService.getArtist(id, offset, (err, data) => {
                if(err){
                    return callback(err)
                }
                callback(null, viewService.render('artist', data))
            })
        }else {
            //TODO: cache service
        }
    })
}

module.exports.controllers = controllers