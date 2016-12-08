"use strict";

const https = require('https');
const sprintf = require('sprintf')
const SpotifyJsonResponse = require('../model/entity/SpotifyJsonResponse')

/**
 * Spotify Repository
 * All requests to spotify api are made here
 */
const spotify = {}
const url = "https://api.spotify.com/v1"
const api = {
    searchArtist: url + "/search?type=artist&q=%s&offset=%s&limit=%s",
    artistInfo: url + "/artists/%s",
    artistAlbums: url + "/artists/%s/albums?offset=%s&limit=%s",
    albumInfo: url + '/albums/%s',
    albumTracks: url + '/albums/%s/tracks?offset=%s&limit=%s'
}

/**
 * SPOTIFY Search for an artist or band
 * Paginated
 *
 * @param artist
 * @param offset
 * @param limit
 * @param cb (error, jsonResponse)
 */
spotify.searchArtist = function (artist, offset, limit, cb) {
    const uri = sprintf(api.searchArtist, encodeURIComponent(artist), offset, limit)
    httpsGetJson(uri, cb)
}

/**
 * SPOTIFY Get artist info
 * Makes two requests, one for the artist info and the albuns for the
 * given offset & limit
 * Albums paginated
 *
 * @param id
 * @param offset
 * @param limit
 * @param cb (err, [artistJson, albumsJson])
 */
spotify.getArtist = function (id, offset, limit, cb) {
    const uris = [
        sprintf(api.artistInfo, encodeURIComponent(id)),
        sprintf(api.artistAlbums, encodeURIComponent(id), offset, limit)
    ]

    httpGetParallelJson(uris, cb) //cb is called when both requests are done
}

/**
 * SPOTIFY Get Album Info
 * with 50 tracks
 *
 * @param id
 * @param cb (error, jsonResponse)
 */
spotify.getAlbumInfo = function (id, cb) {
    const uri = sprintf(api.albumInfo, encodeURIComponent(id))
    httpsGetJson(uri, cb)
}

/**
 * SPOTIFY Get Album Tracks
 * Paginated
 *
 * @param id
 * @param offset
 * @param limit
 * @param cb (error, jsonResponse)
 */
spotify.getAlbumTracks = function (id, offset, limit, cb) {
    const uri = sprintf(api.albumTracks, encodeURIComponent(id), offset, limit)
    httpsGetJson(uri, cb)
}

/**
 * SPOTIFY Get Album Tracks with Album info
 * Paginated
 *
 * @param id
 * @param offset
 * @param limit
 * @param cb (err, [albumJson, tracksJson])
 */
spotify.getAlbumTracksParalelWithAlbumInfo = function (id, offset, limit, cb) {
    const uris = [
        sprintf(api.albumInfo, encodeURIComponent(id)),
        sprintf(api.albumTracks, encodeURIComponent(id), offset, limit)
    ]

    httpGetParallelJson(uris, cb) //cb is called when both requests are done
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
 * @param callback (error, SpotifyJsonResponse)
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
 * TODO: use promises here!
 *
 * @param uris array of uris
 * @param callback (err, [data])
 */
function httpGetParallelJson(uris, callback) {
    let count = 0, arr = []
    uris.forEach((uri) => {
        httpsGetJson(uri, (err, data) => {
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