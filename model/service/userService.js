"use strict";

const mapper = require('./../mapper/userMapperService')
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
     * @returns {Promise} User, is false if not found
     */
    this.findByEmail = function (email) {
        return new Promise((resolve, fail) => {
            repo.findByEmail(email, searchUserCallback(resolve, fail))
        })
    }

    /**
     * Find a user by id
     *
     * @param id
     * @returns {Promise} User, is false if not found
     */
    this.findById = function (id) {
        return new Promise((resolve, fail) => {
            repo.findById(id, searchUserCallback(resolve, fail))
        })
    }

    /**
     * Find a user by email & password
     * Hashes the password
     *
     * @param email
     * @param password
     * @returns {Promise} User, is false if not found
     */
    this.find = function (email, password) {
        return new Promise((resolve, fail) => {
            repo.find(email, hash(password), searchUserCallback(resolve, fail))
        })
    }

    /**
     * Create and store a new user
     * Hashes the password
     *
     * @param email
     * @param password
     * @param name
     * @returns {Promise} User
     */
    this.create = function (email, password, name) {
        return new Promise((resolve, fail) => {
            const pw = hash(password)

            repo.create(email, pw, name, (err, json) => {
                if(err) return fail(err)

                json.email = email // recreate a new user entity to return
                json.password = pw
                json.name = name
                json._id = json.id
                json._rev = json.rev
                resolve(mapper.mapUser(json))
            })
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
 * @param resolve
 * @param fail
 * @return {function(*=, *=)}
 */
function searchUserCallback(resolve, fail) {
    return (err, json) => {
        if(err) return fail(err)

        if(!json) return resolve(false)

        resolve(mapper.mapUser(json))
    }
}


module.exports = DataService
