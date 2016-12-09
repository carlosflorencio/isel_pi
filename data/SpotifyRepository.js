"use strict";

const sprintf = require('sprintf')
const httpsUtil = require('./httpsUtil')
const SpotifyJsonResponse = require('../model/entity/SpotifyJsonResponse')

/**
 * Spotify Repository
 * Gets info from spotify
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
    httpsUtil.httpsGetJson(uri, cb)
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

    httpsUtil.httpsGetParallelJson(uris, cb) //cb is called when both requests are done
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
    httpsUtil.httpsGetJson(uri, cb)
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
    httpsUtil.httpsGetJson(uri, cb)
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

    httpsUtil.httpsGetParallelJson(uris, cb) //cb is called when both requests are done
}


module.exports = spotify