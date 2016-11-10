"use strict";

/**
 * Album Entity
 * @param id
 * @param name
 * @param uri
 * @param image
 * @param type
 * @param label only avaiable on album info
 * @param release_date only avaiable on album info
 * @param tracks only avaiable on album info
 * @constructor
 */
function Album(id, name, uri, image, type, label = null, release_date = null, tracks = null){
    this.id = id
    this.name = name
    this.uri = uri
    this.image = image
    this.type = type
    this.label = label
    this.release_date = release_date
    this.tracks = tracks
}

module.exports = Album

