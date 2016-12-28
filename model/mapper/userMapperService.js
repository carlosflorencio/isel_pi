"use strict";

const User = require('./../entity/User')

const methods = {}

/**
 * Maps couchdb user to User entity
 *
 * Also adds the _rev property
 *
 * @param json User json
 * @return User entity
 */
methods.mapUser = function(json) {
    let user = new User(json._id, json.email, json.password, json.name)
    user._rev = json._rev

    return user
}

module.exports = methods
