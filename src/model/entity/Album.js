"use strict";

/**
 * Album Entity
 * @param id
 * @param name
 * @param uri
 * @param image
 * @param type
 * @constructor
 */
function Album(id, name, uri, image, type){
    this.id = id
    this.name = name
    this.uri = uri
    this.image = image
    this.type = type
}

module.exports = Album
