"use strict";

const https = require('https');
const sprintf = require('sprintf')

const url = "https://api.spotify.com/v1"
const api = {
    searchArtist: url + "/search?type=artist&q=%s&offset=%s",
    artistInfo: url + "/artists/%s",
    artistAlbuns: url + "/artists/%s/album",
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
    https.get(uri, (resp) => {
        let res = ''
        resp.on('error', callback)
        resp.on('data', chunck => res += chunck.toString())
        resp.on('end', () => callback(null, JSON.parse(res)))
    })
}
