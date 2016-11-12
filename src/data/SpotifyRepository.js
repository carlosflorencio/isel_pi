"use strict";

const https = require('https');
const sprintf = require('sprintf')

const SpotifyJsonResponse = require('../model/entity/SpotifyJsonResponse')

const url = "https://api.spotify.com/v1"
const api = {
    searchArtist: url + "/search?type=artist&q=%s&offset=%s&limit=%s",
    artistInfo: url + "/artists/%s",
    artistAlbums: url + "/artists/%s/albums?offset=%s&limit=%s",
    albumInfo: url + '/albums/%s'
}

const spotify = {}

/**
 * SPOTIFY Search for an artist or band
 * Paginated
 *
 * @param artist
 * @param offset
 * @param limit
 * @param cb (response)
 */
spotify.searchArtist = function (artist, offset, limit, cb) {
    const uri = sprintf(api.searchArtist, encodeURIComponent(artist), offset, limit)
    httpsGetJson(uri, cb)
}

/**
 * SPOTIFY Get artist info
 *
 * @param id
 * @param offset
 * @param limit
 * @param cb
 */
spotify.getArtist = function (id, offset, limit, cb) {
    const uris = [
        sprintf(api.artistInfo, encodeURIComponent(id)),
        sprintf(api.artistAlbums, encodeURIComponent(id), offset, limit)
    ]

    httpGetParallelJson(uris, cb)
}

/**
 * SPOTIFY Get Artist albums list
 * Paginated
 *
 * @param id
 * @param offset
 * @param limit
 * @param cb
 */
spotify.getArtistAlbums = function (id, offset, limit, cb) {
    const uri = sprintf(api.artistAlbums, encodeURIComponent(id), offset, limit)
    httpsGetJson(uri, cb)
}

/**
 * SPOTIFY Get Album Info
 * Paginated
 *
 * @param id
 * @param cb
 */
spotify.getAlbumInfo = function (id, cb) {
    const uri = sprintf(api.albumInfo, encodeURIComponent(id))
    httpsGetJson(uri, cb)
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
 *
 * @param uri
 * @param callback (err, SpotifyJsonResponse)
 */
function httpsGetJson(uri, callback) {
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
 * @param uris array of uris
 * @param order array of the order of the data to be retrieved ex:[artist, album]
 * @param callback (err, [data])
 */
function httpGetParallelJson(uris, callback){
    let count = 0, arr = []
    uris.forEach((uri) => {
        httpsGetJson(uri, (err, data) => {
            if(err){
                return callback(err)
            }

            for (let i =0; i<uris.length; i++){
                if(uris[i].endsWith(data.id)){
                    arr[i] = data
                    break;
                }
            }
            if(++count == uris.length){
                callback(null, arr)
            }
        })
    })
}