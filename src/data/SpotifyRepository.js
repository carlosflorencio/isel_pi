"use strict";

const https = require('https');
const sprintf = require('sprintf')

const SpotifyJsonResponse = require('../model/entity/SpotifyJsonResponse')

const url = "https://api.spotify.com/v1"
const api = {
    searchArtist: url + "/search?type=artist&q=%s&offset=%s&limit=%s",
    artistInfo: url + "/artists/%s",
    artistAlbuns: url + "/artists/%s/albums?offset=%s&limit=%s",
    albumInfo: url + '/albums/%s'
}

const spotify = {}

/**
 * SPOTIFY Search for an artist or band
 * Paginated
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
 * @param id
 * @param cb
 */
spotify.getArtist = function (id, cb) {
    const uri = sprintf(api.artistInfo, encodeURIComponent(id))
    httpsGetJson(uri, cb)
}

/**
 * SPOTIFY Get Artist albums list
 * Paginated
 * @param id
 * @param offset
 * @param limit
 * @param cb
 */
spotify.getArtistAlbums = function (id, offset, limit, cb) {
    const uri = sprintf(api.artistAlbuns, encodeURIComponent(id), offset, limit)
    httpsGetJson(uri, cb)
}

/**
 * SPOTIFY Get Album Info
 * Paginated
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
 * @param uri
 * @param callback (err, SpotifyJsonResponse)
 */
function httpsGetJson(uri, callback) {
    https.get(uri, (resp) => {
        let res = ''
        resp.on('error', callback)
        resp.on('data', chunk => res += chunk.toString())
        resp.on('end', () => {
            callback(null, new SpotifyJsonResponse(
                res,
                resp.headers['cache-control'].split('=')[1]
            ))
        })
    })
}
