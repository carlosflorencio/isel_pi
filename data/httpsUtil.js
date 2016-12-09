"use strict";

const https = require('https');
const SpotifyJsonResponse = require('../model/entity/SpotifyJsonResponse')

const util = {}

/**
 * Https get request to the provided uri
 * The response sent to the callback is a json object
 *
 * TODO: use promises here!
 *
 * @param uri
 * @param callback (error, SpotifyJsonResponse)
 */
util.httpsGetJson = function(uri, callback) {
    https.get(uri, (resp) => {
        let res = ''
        resp.on('error', callback)
        resp.on('data', chunk => res += chunk.toString())
        resp.on('end', () => {
            const jsonResponse = new SpotifyJsonResponse(
                resp.req.path,
                res,
                resp.headers['cache-control'].split('=')[1]
            )

            if(jsonResponse.json.error){
                return callback(jsonResponse.json.error)
            }
            callback(null, jsonResponse)
        })
    })
}


/**
 * Get several requests from the array of uris
 * The response sent to the callback is an array of json object
 *
 * TODO: use promises here!
 *
 * @param uris array of uris
 * @param callback (err, [data])
 */
util.httpsGetParallelJson = function(uris, callback) {
    let count = 0, arr = []
    uris.forEach((uri) => {
        this.httpsGetJson(uri, (err, data) => {
            if (err) {
                return callback(err)
            }

            // add the response in the same order as requested
            for (let i = 0; i < uris.length; i++) {
                if (uris[i].endsWith(data.id)) {
                    arr[i] = data
                    break;
                }
            }

            if (++count == uris.length) {
                callback(null, arr)
            }
        })
    })
}

module.exports = util