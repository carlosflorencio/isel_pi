"use strict";

function Album(id, name, uri, images, type){
    this.id = id
    this.name = name
    this.uri = uri
    this.images = images
    this.type = type
}

/**
 * Smallest Avatar url
 * TODO: change this default avatar
 * @return {*|string}
 */
Album.prototype.getSmallerImageUrl = function () {
    return this.images.length > 0 ?
        this.images[this.images.length-1].url : 'http://www.apsono.com/media/com_joomprofile/images/default.png'
}

module.exports = Album
