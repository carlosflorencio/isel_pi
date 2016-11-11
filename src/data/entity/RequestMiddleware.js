"use strict";

/**
 * Request Entity based on Express request.
 *
 * @param pathname  pathname of request
 * @param query     query object {key=value, ...}
 * @constructor
 */
function RequestMiddleware(pathname, query){
    this.pathname = pathname
    this.query = query
    this.params = {q: decodeURIComponent(pathname.split('/')[2])}
}

module.exports = RequestMiddleware
