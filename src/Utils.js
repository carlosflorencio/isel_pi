"use strict";

const url = require('url')
const utils = {}

/**
 * Get the query string parameters from a uri
 *
 * @param uri
 * @return object
 */
utils.getParameters = (uri) => url.parse(uri, true).query

utils.getPathname = (uri) => {
    return url.parse(uri, true).pathname
}

module.exports = utils