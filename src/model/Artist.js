"use strict";

/**
 * Artist Entity
 * @param id
 * @param name
 * @param image
 * @param genres
 * @param popularity
 * @param type
 * @param uri
 * @param totalFollowers
 * @constructor
 */
function Artist(id, name, image, genres, popularity, type, uri, totalFollowers) {
    this.id = id
    this.name = name
    this.image = image
    this.genres = genres
    this.popularity = popularity
    this.type = type
    this.uri = uri
    this.followers = totalFollowers
}

/**
 * Avatar url
 * TODO: change this default avatar
 * @return {*|string}
 */
Artist.prototype.getImageUrl = function () {
        return this.image || 'http://www.apsono.com/media/com_joomprofile/images/default.png'
}

Artist.prototype.getGenresString = function () {
    return this.genres.join(', ')
}

module.exports = Artist