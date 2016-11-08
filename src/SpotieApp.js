"use strict";

const http = require('http')
const handlers = require('./controller/appControllers')
const view = require('./model/service/viewService')
const fs = require('fs')
const utils = require('./Utils')
const config = require('./config.json')
const port = config.port

const contentType = {
    html: "text/html",
    json: "application/json",
    css: "text/css",
    ico: "image/vnd.microsoft.icon",
    png: "image/png"
}

/*
|--------------------------------------------------------------------------
| Web server
|--------------------------------------------------------------------------
*/
http.createServer(processRequests).listen(port)
console.log('HTTP Server running on port ' + port)

/**
 * Entry Point
 * @param req
 * @param resp
 */
function processRequests(req, resp) {
    console.log("Request for: " + req.url);
    const handler = getHandler(req.url)

    if(isAsset(req.url)) // hack before express.js
        return setAssetResponse(resp, req.url)

    if(!handler) {
        return setResponseNotFound(resp)
    }

    handler(req, (err, view) => {
        if(err)
            return setErrorResponse(resp, err)

        resp.writeHead(200, {'Content-Type': contentType.html})
        resp.end(view)
    })
}

/*
|--------------------------------------------------------------------------
| Utils
|--------------------------------------------------------------------------
*/
/**
 * Get the right handler for each endPoint
 * @param url
 * @return {*}
 */
function getHandler(url) {
    const endPoint = getEndPoint(url)

    return handlers.controllers[endPoint]
}

/**
 * Affect the response object with
 * the not found view and 404 http code
 * @param response
 */
function setResponseNotFound(response) {
    response.writeHead(404, {'Content-Type': contentType.html})
    response.end(view.render('404', {title: 'Page Not Found! :('}))
}

/**
 * Affect the response object with
 * the error view and 500 http code
 * @param response
 * @param errorMessage
 */
function setErrorResponse(response, errorMessage) {
    response.writeHead(500, {'Content-Type': contentType.html})
    response.end(view.render('500', {title: 'Ooops! Error :(', message: errorMessage}))
}

/**
 * Helper to serve a file
 * @param response
 * @param filepath
 * @param mimetype
 * @param bytesResponse
 */
function setResponseFile(response, filepath, mimetype, bytesResponse = false) {
    fs.readFile(filepath, (err, data) => {
        if(err)
            return setErrorResponse(response, "Failed to load " + filepath)

        response.writeHead(200, {'Content-Type': mimetype})
        response.end(bytesResponse ? data : data.toString())
    })
}

/**
 * Gets the endpoint from an uri
 * If / returns home
 * @param uri
 * @return {string}
 */
function getEndPoint(uri) {
    const parts = utils.getPathname(uri).split('/')

    // / -> ['', ''], /search/ola -> ['', 'search', 'ola']
    return parts[1] == '' ? 'home' : parts[1]
}

/**
 * Test if the current uri is an asset path
 * @param uri
 * @return {boolean}
 */
function isAsset(uri) {

    const assetsPaths = ['/css/', '/img/', 'favicon.ico']

    for(let i = 0; i < assetsPaths.length; i++) {
        if(uri.indexOf(assetsPaths[i]) != -1)
            return true
    }

    return false
}

/**
 * Affect the response with the right asset content
 * @param resp
 * @param uri
 */
function setAssetResponse(resp, uri) {
    const parts = uri.split('/')
    const file = parts[parts.length - 1]

    if(uri.indexOf('/css/') != -1)
        return setResponseFile(resp, './public/css/' + file, contentType.css)

    if(uri.indexOf('favicon.ico') != -1)
        return setResponseFile(resp, './public/favicon.ico', contentType.ico, true)

    // TODO: the mimetype of the image can be jpg, gif, png, etc.
    return setResponseFile(resp, './public/img/' + file, contentType.png, true)
}