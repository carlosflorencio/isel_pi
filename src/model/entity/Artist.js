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
    this.images = images
    this.genres = genres
    this.popularity = popularity
    this.type = type
    this.uri = uri
    this.followers = totalFollowers
    this.albums = albums
}

/**
 * Smallest Avatar url
 * TODO: change this default avatar
 * @return {*|string}
 */
Artist.prototype.getSmallerImageUrl = function () {
        return this.images.length > 0 ?
            this.images[this.images.length-1].url : 'http://www.apsono.com/media/com_joomprofile/images/default.png'
}

/**
 * Biggest Avatar url
 * TODO: change this default avatar
 * @return {*|string}
 */
Artist.prototype.getBiggestImageUrl = function () {
    return this.images.length > 0 ?
        this.images[0].url : 'http://www.apsono.com/media/com_joomprofile/images/default.png'
}

Artist.prototype.getGenresString = function () {
    return this.genres.join(', ')
}

module.exports = Artist