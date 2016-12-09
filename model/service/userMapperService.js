"use strict";

const User = require('./../entity/User')

const methods = {}

/**
 * Maps couchdb user to User entity
 *
 * Also adds the _id & _rev properties
 *
 * @param json User json
 * @return User entity
 */
methods.mapUser = function(json) {
    let user = new User(json.email, json.password, json.name)
    user._id = json._id
    user._rev = json._rev

    return user
}

module.exports = methods
