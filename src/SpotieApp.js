"use strict";

const port = process.argv[2] || 3000
const http = require('http')
const handlers = require('./controller/appControllers')

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
    const handler = getHandler(req.url)

    handler(req, resp)
}

/*
|--------------------------------------------------------------------------
| Utils
|--------------------------------------------------------------------------
*/
/**
 * Gets the endpoint from an uri
 * If / returns home
 * @param uri
 * @return {string}
 */
function getEndPoint(uri) {
    const parts = uri.split('/')

    // / -> ['', ''], /search/ola -> ['', 'search', 'ola']
    return parts[1] == '' ? 'home' : parts[1]
}

/**
 * Get the right handler for each endPoint
 * @param url
 * @return {*}
 */
function getHandler(url) {
    const endPoint = getEndPoint(url)

    if(isCSS(url)) // hack before using express
        return handlers.special.css
    
    if(handlers.controllers.hasOwnProperty(endPoint))
        return handlers.controllers[endPoint]
    else
        return handlers.special.notFound
}

function isCSS(url) {
    const parts = url.split('/')

    return parts[parts.length - 1] == 'styles.css'
}