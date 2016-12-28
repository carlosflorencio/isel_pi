"use strict";

/**
 * User Entity
 *
 * @param id
 * @param email
 * @param password
 * @param name
 * @constructor
 */
function User(id, email, password, name) {
    this.id = id
    this.email = email
    this.password = password
    this.name = name
}

module.exports = User

