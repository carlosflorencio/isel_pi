"use strict";

const request = require('superagent')
const sprintf = require('sprintf')
const config = require('../config')
const couchdb = require('./couchdbUtils')

/**
 * Playlists Repository
 * Gets playlists info from chouchdb
 */
const playlists = {}
const url = config.couchdb_url + "/playlists/"


/**
 * Find all playlists of the user id provided
 *
 * @param userId
 * @param cb (err, playlistsJson)
 */
playlists.findByUserId = function (userId, cb) {
    request
        .post(url + '_find')
        .send({
            "selector": {
                "user_id": userId,
            },
            "limit": 100
        })
        .end(couchdb.bodyCallback(cb))
}

/**
 * Create a new playlist list for a user
 * Creates a new doc
 * The json response contains ok, id, rev fields
 *
 * @param user_id
 * @param name
 * @param cb
 */
playlists.create = function (user_id, name, cb) {
    request.post(url).send({
        "user_id" : user_id,
        "name": name,
        "tracks": []
    }).end(couchdb.bodyCallback(cb))
}

/**
 * Find a playlist by name, useful to check duplicates
 *
 * @param user_id
 * @param name
 * @param cb
 */
playlists.findUserPlaylistByName = function (user_id, name, cb) {
    request
        .post(url + '_find')
        .send({
            "selector": {
                "user_id": user_id,
                "name": name,
            },
            "limit": 1
        })
        .end(couchdb.searchCallback(cb))
}

/**
 * Playlist update
 *
 * @param playlist
 * @param cb
 */
playlists.updatePlaylist = function (playlist, cb) {
    request
        .put(url + playlist.id)
        .send({
            "user_id": playlist.user_id,
            "name": playlist.name,
            "tracks": playlist.tracks,
            "_rev": playlist._rev
        })
        .end(couchdb.bodyCallback(cb))
}

/**
 * Deletes a playlist
 * Deletes the doc
 *
 * @param id
 * @param rev
 * @param cb
 */
playlists.deletePlaylist = function (id, rev, cb) {
    request
        .delete(url + id)
        .query({ rev: rev })
        .end(couchdb.bodyCallback(cb))
}

module.exports = playlists