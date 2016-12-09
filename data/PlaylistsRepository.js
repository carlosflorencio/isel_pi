"use strict";

const request = require('superagent')
const sprintf = require('sprintf')
const config = require('../config')

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
        .end(bodyCallback(cb))
}

playlists.create = function (user_id, name, cb) {
    request.post(url).send({
        "user_id" : user_id,
        "name": name,
        "tracks": []
    }).end(bodyCallback(cb))
}


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
        .end(searchCallback(cb))
}

playlists.updatePlaylist = function (playlist, cb) {
    request
        .put(url + playlist.id)
        .send({
            "user_id": playlist.user_id,
            "name": playlist.name,
            "tracks": playlist.tracks,
            "_rev": playlist._rev
        })
        .end(bodyCallback(cb))
}

playlists.deletePlaylist = function (id, rev, cb) {
    request
        .delete(url + id)
        .query({ rev: rev })
        .end(bodyCallback(cb))
}


/*
 |--------------------------------------------------------------------------
 | Utils
 |--------------------------------------------------------------------------
 */
/**
 * Return the first document
 *
 * @param callback
 * @return {function(*=, *)}
 */
function searchCallback(callback) {
    return (err, res) => {
        if (err) return callback(err)

        if (res.body.docs.length == 1) { // the doc we want
            return callback(null, res.body.docs[0])
        }

        // no results
        return callback(null, false)
    }
}

function bodyCallback(callback) {
    return (err, res) => {
        if (err) return callback(err)

        return callback(null, res.body)
    }
}

module.exports = playlists