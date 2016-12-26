"use strict";

const request = require('superagent')
const sprintf = require('sprintf')
const config = require('../config')
const couchdb = require('./couchdbUtils')

/**
 * Invites Repository
 * Manages invites from chouchdb
 */
const invites = {}
const url = config.couchdb_url + "/invites/"


/**
 * Send playlist invitation to a user
 * Creates a new doc
 * The json response contains ok, id, rev fields
 *
 * @param toEmail
 * @param fromEmail
 * @param playlistID
 * @param writable bool
 * @param cb (err, couchdbObj)
 */
invites.sendInvitation = function (toEmail, fromEmail, playlistID, writable, cb) {
    request
        .post(url)
        .send({
            "accepted": false,
            "toUser": toEmail,
            "fromUser": fromEmail,
            "playlistId": playlistID,
            "write": writable
        })
        .end(couchdb.bodyCallback(cb))
}


/*
 |--------------------------------------------------------------------------
 | Utils
 |--------------------------------------------------------------------------
 */


module.exports = invites