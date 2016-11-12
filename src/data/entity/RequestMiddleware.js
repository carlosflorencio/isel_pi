"use strict";

/**
 * Request Entity based on Express request.
 *
 * @param uri url object
 * @constructor
 */
function RequestMiddleware(uri){
    this.pathname = uri.pathname
    this.query = uri.query

    const g = decodeURIComponent(this.pathname.split('/')[2])
    this.params = {
        id: g,
        artist: g
    }
}

module.exports = RequestMiddleware
