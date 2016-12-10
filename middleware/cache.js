const Factory = require('../model/service/serviceFactory')
const path = require('path')
const debug = require('debug')('cacheMiddlware');

// Static for all routes, make it local for each router?
const cache = Factory.cacheService(path.join(__dirname, '../storage/cache'))

/**
 * Cache middleware
 * Caches the response for a period of time
 * Add this middlware before your controller middleware
 *
 * Uses the path of the request as key
 * Also has support for page & limit query string values
 *
 * To add a custom expire time use:
 * res.locals.expire = 3600 // seconds -> 1 hour
 *
 * Uses cache service with 2 levels, memory and disk
 * @param seconds default 7200 -> 2 hours
 * @param type Response type, default = 'html'
 * @return {function(*, *, *)}
 */
function cacheMiddlware (seconds = 7200, type = 'html') {
    return (req, res, next) => {

        // we dont want to cache the view if we have a user
        if(req.isAuthenticated()) {
            return next()
        }

        let key = obtainKeyForRequest(req)

        cache.get(key, (err, value) => {
            res.type(type)

            if(err) { // no cached value, lets continue
                res.sendResponse = res.send // save original send method
                res.send = (body) => { // the next middleware will call this method
                    const time = parseInt(res.locals.expire) || seconds
                    cache.put(key, body, time * 1000); // add to cache the new body
                    res.sendResponse(body) // call the original send method
                }
                return next() // proceed to the next middlware
            }

            // we have a cached value, lets send the response and return
            return res.send(value)
        })
    }
}

/**
 * Generate a key value from a request path and query string values
 * using path + page + limit values
 * @param req
 * @return {XML|string|void|*}
 */
function obtainKeyForRequest(req) {
    const path = req.baseUrl + req.path
    let candidateKey = path.replace(/\//g, '_') // replace / with _

    if(req.query.page) {
        candidateKey += '_p_' + req.query.page
    }

    if(req.query.limit) {
        candidateKey += '_l_' + req.query.limit
    }

    return candidateKey
}

module.exports = cacheMiddlware