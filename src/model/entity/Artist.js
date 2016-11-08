"use strict";

/**
 * Artist Entity
 * @param id    id of the artist
 * @param name  name of the artist
 * @param images images of the artist
 * @param genres genres played by the artist
 * @param popularity popularity of the artist
 * @param uri
 * @param totalFollowers
 * @param albums Collection of albums
 * @constructor
 */
function Artist(id, name, images, genres, popularity, type, uri, totalFollowers, albums) {
    this.id = id
    this.name = name
    this.image = image
    this.genres = genres
    this.popularity = popularity
    this.type = type
    this.uri = uri
    this.followers = totalFollowers
    this.albums = albums
}

/**
 * Convert the Genres array to a string representation
 * @return {*|string}
 */
Artist.prototype.getGenresString = function () {
    return this.genres.join(', ')
}

module.exports = Artist