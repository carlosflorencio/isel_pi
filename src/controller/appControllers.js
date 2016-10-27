"use strict";

const viewService = require('../model/viewService')
const dataService = require('../model/dataService')
const utils = require('../Utils')
const controllers = {}

/**
 * Home controller
 * @param request
 * @param response
 */
controllers.home = function (request, response) {
    response.writeHead(200, {'Content-Type': 'text/html'})

    response.end(viewService.get('home', {title: "Homepage"}))
}

/**
 * Artist search
 * @param request
 * @param response
 */
controllers.search = function (request, response) {
    response.writeHead(200, {'Content-Type': 'text/html'})
    const params = utils.getParameters(request.url)
    const offset = params.offset || 0
    const artist = params.q || request.url.split('/')[2]

    if(!artist)
        return errorResponse("No artist provided!", response)

    dataService.searchArtist(artist, offset, (err, data) => {
        if(err)
            return errorResponse(err, response)

        data.query = artist
        response.end(viewService.get('search', data))
    })
}

/*
 |--------------------------------------------------------------------------
 | Special Actions 404 & 500
 |--------------------------------------------------------------------------
 */
const specialControllers = {}

specialControllers.notFound = function (request, response) {
    response.writeHead(404, {'Content-Type': 'text/html'})
    response.end(viewService.get('404', {title: 'Page Not Found! :('}))
}

specialControllers.error = function (request, response) {
    errorResponse("Sorry! Something went wrong! Our fault..", response)
}

/**
 * Helper response for when an error occurs
 * @param message
 * @param response
 */
function errorResponse(message, response) {
    response.writeHead(500, {'Content-Type': 'text/html'})
    response.end(viewService.get('500', {title: 'Ooops! Error :(', message: message}))
}

module.exports.controllers = controllers
module.exports.special = specialControllers