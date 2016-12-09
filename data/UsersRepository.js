"use strict";

const request = require('superagent')
const sprintf = require('sprintf')

/**
 * Users Repository
 * Gets user info from chouchdb
 */
const user = {}
const url = "http://localhost:5984/users"


/**
 * Find the user by id
 *
 * @param id
 * @param callback (err, user) if no user was found, user is false
 */
user.findById = function (id, callback) {
    request.get(url + '/' + id)
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
    request.post(url + '/_find')
        .send({
            "selector": {
                "email": email,
            },
            "limit": 1
        })
        .end(searchCallback(callback))
}

/**
 * Find the user with the email and password provided
 *
 * @param email
 * @param password
 * @param callback (err, user) if no user was found, user is false
 */
user.find = function (email, password, callback) {
    request.post(url + '/_find').send({
        "selector": {
            "email": email,
            "password": password
        },
        "limit": 1
    }).end(searchCallback(callback))
}

/**
 * Create a user using the provided info
 *
 * The json response contains ok, id, rev fields
 *
 * @param email
 * @param password
 * @param name
 * @param callback (err, json)
 */
user.create = function (email, password, name, callback) {
    request.post(url + '/').send({
        "email": email,
        "password": password,
        "name": name
    })
    .end((err, res) => {
        if (err) return callback(err)

        return callback(null, res.body)
    })
}

/*
 |--------------------------------------------------------------------------
 | Utils
 |--------------------------------------------------------------------------
 */
/**
 * Return the first document
 *
 * @param callback
 * @return {function(*=, *)}
 */
function searchCallback(callback) {
    return (err, res) => {
        if (err) return callback(err)

        if (res.body.docs.length == 1) { // the doc we want
            return callback(null, res.body.docs[0])
        }

        // no results
        return callback(null, false)
    }
}

module.exports = user