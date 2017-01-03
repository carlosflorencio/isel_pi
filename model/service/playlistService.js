"use strict";

const mapper = require('./../mapper/playlistMapperService')
const Playlist = require('../entity/Playlist')

/**
 * Playlist Data Service
 *
 * @param repo
 * @constructor
 */
function DataService(repo) {

    /**
     * Gets all playlists of the user
     *
     * @param user_id
     * @returns {Promise} Playlists, array
     */
    this.playlistsOfUser = function (user_id) {
        return new Promise((resolve, fail) => {
            repo.findByUserId(user_id, (err, json) => {
                if(err) return fail(err)
                let playlists = mapper.mapPlaylists(json)

                return resolve(playlists)
            })
        })
    }

    /**
     * Get multiple playlists by ID
     *
     * @param idsArray array of strings with the ids
     * @returns {Promise} Playlists, array
     */
    this.getMultiplePlaylists = function (idsArray) {
        return new Promise((resolve, fail) => {
            if(idsArray.length == 0) return resolve([])

            repo.getMultipleById(idsArray, (err, json) => {
                if(err) return fail(err)

                return resolve(mapper.mapPlaylists(json))
            })
        })
    }

    /**
     * Gets a playlist by its ID
     *
     * @param id
     * @returns {Promise} Playlist, can be false if not found
     */
    this.getPlaylistById = function (id) {
        return new Promise((resolve, fail) => {
            repo.findById(id, (err, json) => {
                if(err) return fail(err)

                // no playlist found
                if(!json) return resolve(false)

                return resolve(mapper.mapPlaylist(json))
            })
        })
    }

    /**
     * Creates a new playlist
     *
     * The json response for create only returns ok, id & rev
     *
     * @param user_id
     * @param name
     * @returns {Promise} Playlist
     */
    this.createPlaylist = function (user_id, name) {
        return new Promise((resolve, fail) => {
            repo.create(user_id, name, (err, json) => {
                if(err) return fail(err)

                let playlist = new Playlist(json.id, user_id, name, [])
                playlist._rev = json.rev // we need the _rev to update & delete

                return resolve(playlist)
            })
        })
    }

    /**
     * Gets the playlist by its name of false if does not exist
     *
     * @param user_id
     * @param name
     * @returns {Promise} Playlist, can be false if not found
     */
    this.findUserPlaylistByName = function (user_id, name) {
        return new Promise((resolve, fail) => {
            repo.findUserPlaylistByName(user_id, name, (err, json) => {
                if(err) return fail(err)

                if(!json) return resolve(false)

                return resolve(mapper.mapPlaylist(json))
            })
        })
    }

    /**
     * Updates the playlist
     * All fields are updated!
     *
     * The json response contains ok, id, rev fields
     * @param playlist
     * @returns {Promise} Playlist, is same but with the _rev updated
     */
    this.updatePlaylist = function (playlist) {
        return new Promise((resolve, fail) => {
            repo.updatePlaylist(playlist, (err, json) => {
                if(err) return fail(err)

                // we need to updated the rev
                playlist._rev = json.rev

                return resolve(playlist)
            })
        })
    }

    /**
     * Deletes the playlist
     *
     * @param playlist
     * @returns {Promise} ok, boolean
     */
    this.deletePlaylist = function (playlist) {
        return new Promise((resolve, fail) => {
            repo.deletePlaylist(playlist.id, playlist._rev, (err, json) => {
                if(err) return fail(err)

                return resolve(json.ok)
            })
        })
    }
}


module.exports = DataService
