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
     * Create a new Invitation of a shared playlist
     *
     * @param toEmail
     * @param fromUser
     * @param playlistId
     * @param writable
     * @param cb (error, couchdbInsertResponseJson)
     */
    this.sendInvitation = function (toEmail, fromUser, playlistId, writable, cb) {
        repo.sendInvitation(toEmail, fromUser.email, playlistId, writable, (err, json) => {
            if(err) return cb(err)

            // this json is the couchdb ok, id, rev fields
            return cb(null, json)
        })
    }

    /**
     * Gets a specific Invitation
     *
     * @param toEmail
     * @param fromEmail
     * @param playlistId
     * @param cb (err, Invite) Invite can be false if not found
     */
    this.getInvitation = function (toEmail, fromEmail, playlistId, cb) {
        repo.getInvitation(toEmail, fromEmail, playlistId, (err, json) => {
            if(err) return cb(err)

            if(!json) return cb(null, false)

            cb(null, mapper.mapInvite(json))
        })
    }

    /**
     * Gets a specific Invitation by user and playlist
     *
     * @param toEmail
     * @param playlistId
     * @param cb (err, Invite) Invite can be false if not found
     */
    this.getInvitationByPlaylistAndUser = function (toEmail, playlistId, cb) {
        repo.getInvitationByPlaylistAndUser(toEmail, playlistId, (err, json) => {
            if(err) return cb(err)

            if(!json) return cb(null, false)

            cb(null, mapper.mapInvite(json))
        })
    }

    /**
     * Get all invitations of an user
     *
     * @param userEmail
     * @param cb (err, InviteArray)
     */
    this.getInvitations = function (userEmail, cb) {
        repo.getInvitationsOfUser(userEmail, (err, json) => {
            if(err) return cb(err)

            cb(null, mapper.mapInvites(json))
        })
    }

    /**
     * Gets a specific Invitation by ID
     *
     * @param id
     * @param cb
     */
    this.getInvitationById = function (id, cb) {
        repo.getInvitationById(id, (err, json) => {
            if(err) return cb(err)

            if(!json) return cb(null, false)

            cb(null, mapper.mapInvite(json))
        })
    }

    /**
     * Gets the invitations of a playlist sent by the user
     *
     * @param fromEmail
     * @param playlistId
     * @param cb (err, InvitesArray)
     */
    this.getInvitesOfPlaylist = function (fromEmail, playlistId, cb) {
        repo.getInvitesOfPlaylist(fromEmail, playlistId, (err, json) => {
            if(err) return cb(err)

            cb(null, mapper.mapInvites(json))
        })
    }

    /**
     * Deletes an Invitation
     *
     * @param invite
     * @param cb
     */
    this.deleteInvite = function (invite, cb) {
        repo.deleteInvite(invite.id, invite._rev, (err, json) => {
            if(err) return cb(err)

            cb(null, json.ok)
        })
    }

    /**
     * Updates an Invitation
     *
     * @param invite
     * @param cb
     */
    this.updateInvite = function (invite, cb) {
        repo.updateInvite(invite, (err, json) => {
            if(err) return cb(err)

            // we have to update the rev
            invite._rev = json.rev

            cb(null, invite)
        })
    }


}


module.exports = DataService
