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
     * @param cb (err, playlists)
     */
    this.playlistsOfUser = function (user_id, cb) {
        repo.findByUserId(user_id, (err, json) => {
            if(err) return cb(err)
            let playlists = mapper.mapPlaylists(json)

            return cb(null, playlists)
        })
    }

    /**
     * Get multiple playlists by ID
     *
     * @param idsArray array of strings with the ids
     * @param cb (err, PlaylistsArray)
     */
    this.getMultiplePlaylists = function (idsArray, cb) {
        repo.getMultipleById(idsArray, (err, json) => {
            if(err) return cb(err)

            return cb(null, mapper.mapPlaylists(json))
        })
    }

    /**
     * Gets a playlist by its ID
     *
     * @param id
     * @param cb (err, Playlist) Playlist can be false if not found
     */
    this.getPlaylistById = function (id, cb) {
        repo.findById(id, (err, json) => {
            if(err) return cb(err)

            // no playlist found
            if(!json) return cb(null, false)

            return cb(null, mapper.mapPlaylist(json))
        })
    }

    /**
     * Creates a new playlist
     *
     * The json response for create only returns ok, id & rev
     *
     * @param user_id
     * @param name
     * @param cb (err, playlist)
     */
    this.createPlaylist = function (user_id, name, cb) {
        repo.create(user_id, name, (err, json) => {
            if(err) return cb(err)

            let playlist = new Playlist(json.id, user_id, name, [])
            playlist._rev = json.rev // we need the _rev to update & delete

            return cb(null, playlist)
        })
    }

    /**
     * Gets the playlist by its name of false if does not exist
     *
     * @param user_id
     * @param name
     * @param cb (err, playlist) playlist=false if not found
     */
    this.findUserPlaylistByName = function (user_id, name, cb) {
        repo.findUserPlaylistByName(user_id, name, (err, json) => {
            if(err) return cb(err)

            if(!json) return cb(null, false)

            return cb(null, mapper.mapPlaylist(json))
        })
    }

    /**
     * Updates the playlist
     * All fields are updated!
     *
     * The json response contains ok, id, rev fields
     * @param playlist
     * @param cb(err, Playlist) Playlist is same with the _rev updated
     */
    this.updatePlaylist = function (playlist, cb) {
        repo.updatePlaylist(playlist, (err, json) => {
            if(err) return cb(err)

            // we need to updated the rev
            playlist._rev = json.rev

            return cb(null, playlist)
        })
    }

    /**
     * Deletes the playlist
     *
     * @param plalist
     * @param cb (err, boolean)
     */
    this.deletePlaylist = function (plalist, cb) {
        repo.deletePlaylist(plalist.id, plalist._rev, (err, json) => {
            if(err) return cb(err)

            return cb(null, json.ok)
        })
    }


}


module.exports = DataService
