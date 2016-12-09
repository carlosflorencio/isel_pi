"use strict";

/**
 * Playlist Entity
 *
 * @param id
 * @param user_id
 * @param name
 * @param tracks array of tracks entities
 * @constructor
 */
function Playlist(id, user_id, name, tracks){
    this.id = id
    this.user_id = user_id
    this.name = name
    this.tracks = tracks
}

module.exports = Playlist

