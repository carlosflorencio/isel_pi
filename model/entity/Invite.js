"use strict";

/**
 * Invite Entity
 *
 * @param id
 * @param accepted
 * @param toEmail
 * @param fromEmail
 * @param playlistId
 * @param writable bool
 * @param playlistObj optional
 * @param fromUserObj optional
 * @constructor
 */
function Invite(id, accepted, toEmail, fromEmail, playlistId, writable, playlistObj = null, fromUserObj = null) {
    this.id = id
    this.accepted = accepted
    this.toEmail = toEmail
    this.fromEmail = fromEmail
    this.playlistId = playlistId
    this.writable = writable
    this.playlist = playlistObj
    this.fromUser = fromUserObj
}

module.exports = Invite

