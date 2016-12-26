"use strict";

const mapper = require('./../mapper/inviteMapperService')
const Invite = require('../entity/Invite')

/**
 * Invite Data Service
 *
 * @param repo
 * @constructor
 */
function DataService(repo) {


    /**
     * Creates a new playlist
     * @param user_id
     * @param name
     * @param cb (err, playlist)
     */
    this.sendInvitation = function (toEmail, fromUser, playlist, writable, cb) {
        repo.sendInvitation(user_id, name, (err, json) => {
            if(err) return cb(err)
            console.log(json);

            let playlist = new Playlist(json.id, user_id, name, [])
            playlist._rev = json.rev // we need the _rev to update & delete

            return cb(null, playlist)
        })
    }


}


module.exports = DataService
