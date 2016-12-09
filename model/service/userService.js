"use strict";

const mapper = require('./userMapperService')
const crypto = require('crypto');

/**
 * Data Service is used to help retrieve data from a repository and map it into a model entity
 * @param repo repository of the data
 */
function DataService(repo) {

    /**
     * Find a user by email
     *
     * @param email
     * @param cb (err, User) User is false if not found
     */
    this.findByEmail = function (email, cb) {
        repo.findByEmail(email, searchUserCallback(cb))
    }

    /**
     * Find a user by id
     *
     * @param id
     * @param cb (err, User) User is false if not found
     */
    this.findById = function (id, cb) {
        repo.findById(id, searchUserCallback(cb))
    }

    /**
     * Find a user by email & password
     *
     * @param email
     * @param password
     * @param cb (err, User) User is false if not found
     */
    this.find = function (email, password, cb) {
        repo.find(email, hash(password), searchUserCallback(cb))
    }

    /**
     * Create and store a new user
     *
     * @param email
     * @param password
     * @param name
     * @param cb (err, User) User created
     */
    this.create = function (email, password, name, cb) {
        const pw = hash(password)
        repo.create(email, pw, name, (err, json) => {
            if(err) return cb(err)

            json.email = email // recreate a new user entity to return
            json.password = pw
            json.name = name
            json._id = json.id
            json._rev = json.rev
            cb(null, mapper.mapUser(json))
        })
    }
}

/*
|--------------------------------------------------------------------------
| Util
|--------------------------------------------------------------------------
*/
/**
 * Simple hash to avoid plain text
 * NOT SECURE! SHOULD NOT BE USED ON PRODUCTION
 * JUST FOR TEST PURPOSES
 * @param password
 * @return {*}
 */
function hash(password) {
    return crypto.createHash('sha1').update(password).digest('hex');
}

/**
 * Parses a user document response
 *
 * @param cb
 * @return {function(*=, *=)}
 */
function searchUserCallback(cb) {
    return (err, json) => {
        if(err) return cb(err)

        if(!json) return cb(null, false)

        cb(null, mapper.mapUser(json))
    }
}


module.exports = DataService
