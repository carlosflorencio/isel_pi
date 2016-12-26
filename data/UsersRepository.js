"use strict";

const request = require('superagent')
const sprintf = require('sprintf')
const config  = require('../config')
const couchdb = require('./couchdbUtils')

/**
 * Users Repository
 * Gets user info from chouchdb
 */
const user = {}
const url = config.couchdb_url + "/users/"


/**
 * Find the user by id
 * Gets the doc db/id
 *
 * @param id
 * @param callback (err, user) if no user was found, user is false
 */
user.findById = function (id, callback) {
    request.get(url + id)
        .end((err, res) => {
            if (err) return callback(err)

            if (res.body.error) { // no user
                return callback(null, false)
            }

            return callback(null, res.body)
        })
}

/**
 * Find the user by email
 *
 * @param email
 * @param callback (err, user) if no user was found, user is false
 */
user.findByEmail = function (email, callback) {
    request.post(url + '_find')
        .send({
            "selector": {
                "email": email,
            },
            "limit": 1
        })
        .end(couchdb.searchCallback(callback))
}

/**
 * Find the user with the email and password provided
 *
 * @param email
 * @param password
 * @param callback (err, user) if no user was found, user is false
 */
user.find = function (email, password, callback) {
    request.post(url + '_find').send({
        "selector": {
            "email": email,
            "password": password
        },
        "limit": 1
    }).end(couchdb.searchCallback(callback))
}

/**
 * Create a user using the provided info
 * Creates a new doc
 * The json response contains ok, id, rev fields
 *
 * @param email
 * @param password
 * @param name
 * @param callback (err, json)
 */
user.create = function (email, password, name, callback) {
    request.post(url).send({
        "email": email,
        "password": password,
        "name": name
    })
    .end(couchdb.bodyCallback(callback))
}

module.exports = user