"use strict";

const viewService = require('../model/service/viewService')
const dataService = require('../model/service/dataService')
const utils = require('../Utils')
const cacheService = require('../model/service/cacheService')

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
    const offset = params.offset || 0
    const artist = params.q || request.url.split('/')[2]

    if (!artist)
        return callback("No artist provided!")

    dataService.searchArtist(artist, offset, (err, collection) => {
        if (err)
            return callback(err)

        collection.query = artist
        collection.title = collection.total + " Results for " + artist

        callback(null, viewService.render('search', collection))
    })

}

controllers.artist = function (request, callback) {
    const id = 1
    const offset = 0

    cacheService.fetchArtist(id, offset, (err, view) => {
        if(err)
           return callback(err)

        if(!view) {

            // ir buscar os dados, e adicionar à cache

        }


        callback(null, view)
    })

}

module.exports.controllers = controllers