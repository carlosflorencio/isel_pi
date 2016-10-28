"use strict";

const port = process.argv[2] || 3000
const http = require('http')
const handlers = require('./controller/appControllers')
const view = require('./model/service/viewService')
const fs = require('fs')

const contentType = {
    html: "text/html",
    json: "application/json",
    css: "text/css"
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

    if(isCSS(req.url)) // will be removed when using express.js
        return setResponseCss(resp)

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
 * Helper to serve CSS
 * Will be removed when using express.js
 * @param response
 */
function setResponseCss(response) {
    fs.readFile('./public/styles.css', (err, data) => {
        if(err)
            return setErrorResponse(response, "Failed to obtain css")

        response.writeHead(200, {'Content-Type': contentType.css})
        response.end(data.toString())
    })
}

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
 * Helper to serve css to that path
 * @param url
 * @return {boolean}
 */
function isCSS(url) {
    const parts = url.split('/')

    return parts[parts.length - 1] == 'styles.css'
}