"use strict";

const Playlist = require('./../entity/Playlist')

const methods = {}


methods.mapPlaylist = function (json) {
    let playlist = new Playlist(
        json._id,
        json.user_id,
        json.name,
        json.tracks
    )

    playlist._rev = json._rev

    return playlist
}

methods.mapPlaylists = function (json) {
    return json.docs.map(playlist => this.mapPlaylist(playlist))
}

module.exports = methods
