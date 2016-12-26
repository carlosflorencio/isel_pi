"use strict";

const Invite = require('./../entity/Invite')

const methods = {}

/**
 * Map Couchdb Invite document to an Invite model entity
 * @param json
 * @returns {Invite}
 */
methods.mapInvite = function (json) {
    let invite = new Invite(
        json._id,
        json.accepted,
        json.toUser,
        json.fromUser,
        json.playlistId,
        json.write
    )

    // Rev is important to update & delete
    invite._rev = json._rev

    return invite
}

/**
 * Maps couchdb json with an array of invites docs to an array of Invites Entities
 * @param json
 * @return {Array|*|{}}
 */
methods.mapInvites = function (json) {
    return json.docs.map(invite => this.mapInvite(invite))
}

module.exports = methods
