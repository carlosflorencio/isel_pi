"use strict";

/**
 * User Entity
 *
 * @param email
 * @param password
 * @param name
 * @constructor
 */
function User(email, password, name){
    this.email = email
    this.password = password
    this.name = name
}

module.exports = User

