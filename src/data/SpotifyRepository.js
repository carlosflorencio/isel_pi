"use strict";

const https = require('https');
const sprintf = require('sprintf')

const JsonResponse = require('../model/entity/JsonResponse')

const url = "https://api.spotify.com/v1"
const api = {
    searchArtist: url + "/search?type=artist&q=%s&offset=%s",
    artistInfo: url + "/artists/%s",
    artistAlbuns: url + "/artists/%s/albums",
    albumInfo: url + '/albums/%s'
}

const spotify = {}

/**
 * Search for an artist or band
 * @param artist
 * @param offset
 * @param cb (response)
 */
spotify.searchArtist = function (artist, offset, cb) {
    const uri = sprintf(api.searchArtist, encodeURIComponent(artist), offset)
    get(uri, cb)
}

spotify.getArtist = function (id, offset, cb) {
    const uri = sprintf(api.artistInfo, encodeURIComponent(id))
    get(uri, cb)
}

spotify.getArtistAlbums = function (id, offset, cb) {
    const uri = sprintf(api.artistAlbuns, encodeURIComponent(id))
    get(uri, cb)
}

module.exports = spotify

/*
 |--------------------------------------------------------------------------
 | Utils
 |--------------------------------------------------------------------------
 */
/**
 * Http get request to the provided uri
 * The response sent to the callback is a json object
 * @param uri
 * @param callback (err, response)
 */
function get(uri, callback) {
    let cache = false
    if(cache){

    } else {
        https.get(uri, (resp) => {
            let res = ''
            resp.on('error', callback)
            resp.on('data', chunk => res += chunk.toString())
            resp.on('end', () => {
                callback(null, new JsonResponse(
                    resp.headers['cache-control'].split('=')[1],
                    JSON.parse(res))
                )
            })
        })
    }
}
