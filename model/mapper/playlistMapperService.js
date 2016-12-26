"use strict";

const Playlist = require('./../entity/Playlist')

const methods = {}

/**
 * Maps couchdb json from playlist db to a Playlist Entity
 * @param json
 * @return {Playlist}
 */
methods.mapPlaylist = function (json) {
    let playlist = new Playlist(
        json._id,
        json.user_id,
        json.name,
        json.tracks
    )

    // Rev is important to update & delete
    playlist._rev = json._rev

    return playlist
}

/**
 * Maps couchdb json with an array of playlists to a Playlist Entity
 * @param json
 * @return {Array|*|{}}
 */
methods.mapPlaylists = function (json) {
    return json.docs.map(playlist => this.mapPlaylist(playlist))
}

module.exports = methods
