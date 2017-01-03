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
     * @param fromEmail
     * @param playlistId
     * @param writable
     * @returns {Promise} Invite
     */
    this.sendInvitation = function (toEmail, fromEmail, playlistId, writable) {
        return new Promise((resolve, fail) => {
            repo.sendInvitation(toEmail, fromEmail, playlistId, writable, (err, json) => {
                if(err) return fail(err)

                // this json is the couchdb ok, id, rev fields
                let invite = new Invite(json.id, false, toEmail, fromEmail, playlistId, writable)
                invite._rev = json.rev

                return resolve(invite)
            })
        })
    }

    /**
     * Gets a specific Invitation
     *
     * @param toEmail
     * @param fromEmail
     * @param playlistId
     * @returns {Promise} Invite, can be false if not found
     */
    this.getInvitation = function (toEmail, fromEmail, playlistId) {
        return new Promise((resolve, fail) => {
            repo.getInvitation(toEmail, fromEmail, playlistId, (err, json) => {
                if(err) return fail(err)

                if(!json) return resolve(false)

                resolve(mapper.mapInvite(json))
            })
        })
    }

    /**
     * Gets a specific Invitation by user and playlist
     *
     * @param toEmail
     * @param playlistId
     * @returns {Promise} Invite, can be false if not found
     */
    this.getInvitationByPlaylistAndUser = function (toEmail, playlistId) {
        return new Promise((resolve, fail) => {
            repo.getInvitationByPlaylistAndUser(toEmail, playlistId, (err, json) => {
                if(err) return fail(err)

                if(!json) return resolve(false)

                resolve(mapper.mapInvite(json))
            })
        })
    }

    /**
     * Get all invitations of an user
     *
     * @param userEmail
     * @returns {Promise} Invites, array
     */
    this.getInvitations = function (userEmail) {
        return new Promise((resolve, fail) => {
            repo.getInvitationsOfUser(userEmail, (err, json) => {
                if(err) return fail(err)

                resolve(mapper.mapInvites(json))
            })
        })
    }

    /**
     * Get all unaccepted invites of an user
     *
     * @param userEmail
     * @returns {Promise}
     */
    this.getPendingInvitations = function (userEmail) {
        return new Promise((resolve, fail) => {
            repo.getPendingInvitationsOfUser(userEmail, (err, json) => {
                if(err) return fail(err)

                resolve(mapper.mapInvites(json))
            })
        })
    }

    /**
     * Gets a specific Invitation by ID
     *
     * @param id
     * @returns {Promise} Invite, can be false if not found
     */
    this.getInvitationById = function (id) {
        return new Promise((resolve, fail) => {
            repo.getInvitationById(id, (err, json) => {
                if(err) return fail(err)

                if(!json) return resolve(false)

                resolve(mapper.mapInvite(json))
            })
        })
    }

    /**
     * Gets the invitations of a playlist sent by the user
     *
     * @param fromEmail
     * @param playlistId
     * @returns {Promise} Invites, array
     */
    this.getInvitesOfPlaylist = function (fromEmail, playlistId) {
        return new Promise((resolve, fail) => {
            repo.getInvitesOfPlaylist(fromEmail, playlistId, (err, json) => {
                if(err) return fail(err)

                resolve(mapper.mapInvites(json))
            })
        })
    }

    /**
     * Deletes an Invitation
     *
     * @param invite
     * @returns {Promise} ok, boolean
     */
    this.deleteInvite = function (invite) {
        return new Promise((resolve, fail) => {
            repo.deleteInvite(invite.id, invite._rev, (err, json) => {
                if(err) return fail(err)

                resolve(json.ok)
            })
        })
    }

    /**
     * Updates an Invitation
     *
     * @param invite
     * @returns {Promise} Invite, the same but with rev updated
     */
    this.updateInvite = function (invite) {
        return new Promise((resolve, fail) => {
            repo.updateInvite(invite, (err, json) => {
                if(err) return fail(err)

                // we have to update the rev
                invite._rev = json.rev

                resolve(invite)
            })
        })
    }


}


module.exports = DataService
