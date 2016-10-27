"use strict";

const viewService = require('../model/viewService')
const dataService = require('../model/dataService')
const utils = require('../Utils')
const fs = require('fs')

const contentType = {
    html: "text/html",
    json: "application/json",
    css: "text/css"
}

const controllers = {}

/**
 * Home controller
 * @param request
 * @param response
 */
controllers.home = function (request, response) {
    response.writeHead(200, {'Content-Type': contentType.html})

    response.end(viewService.render('home', {title: "Homepage"}))
}

/**
 * Artist search
 * @param request
 * @param response
 */
controllers.search = function (request, response) {
    response.writeHead(200, {'Content-Type': contentType.html})
    const params = utils.getParameters(request.url)
    const offset = params.offset || 0
    const artist = params.q || request.url.split('/')[2]

    if (!artist)
        return errorResponse("No artist provided!", response)

    dataService.searchArtist(artist, offset, (err, collection) => {
        if (err)
            return errorResponse(err, response)

        collection.query = artist
        collection.title = collection.total + " Results for " + artist
        response.end(viewService.render('search', collection))
    })
}

/*
 |--------------------------------------------------------------------------
 | Special Actions 404 & 500
 |--------------------------------------------------------------------------
 */
const specialControllers = {}

/**
 * Not found controller
 * @param request
 * @param response
 */
specialControllers.notFound = function (request, response) {
    response.writeHead(404, {'Content-Type': contentType.html})
    response.end(viewService.render('404', {title: 'Page Not Found! :('}))
}

/**
 * CSS controller, just a hack before using express.js
 * @param request
 * @param response
 */
specialControllers.css = function (request, response) {
    response.writeHead(200, {'Content-Type': contentType.css})

    fs.readFile('./public/styles.css', (err, data) => {
        if(err)
            return errorResponse("Failed to obtain css", response)

        response.end(data.toString())
    })
}

/**
 * Helper response for when an error occurs
 * @param message
 * @param response
 */
function errorResponse(message, response) {
    response.writeHead(500, {'Content-Type': contentType.html})
    response.end(viewService.render('500', {title: 'Ooops! Error :(', message: message}))
}

module.exports.controllers = controllers
module.exports.special = specialControllers