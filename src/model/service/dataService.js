"use strict";

const mapper = require('./mapperService')

/**
 * Data Service is used to help retrieve data from a repository and map it into an model entity
 * @param repo repository of the data
 */
const dataService = function DataService(repo){

    /**
     * Search Artist using Spotify data
     *
     * @param name
     * @param page
     * @param limit
     * @param cb
     */
    this.searchArtist = function(name, page, limit, cb) {
        repo.searchArtist(name, getOffset(page, limit), limit, (err, spotifyJsonResponse) => {
            if(err)
                return cb(err)

            const collection = mapper.mapArtistsToCollection(spotifyJsonResponse.json)
            collection.expire = spotifyJsonResponse.lifetime

            cb(null, collection)
        })
    }

    /**
     * Get Artist and his Albums
     *
     * @param id
     * @param page
     * @param limit
     * @param cb
     */
    this.getArtistInfoWithAlbums = function (id, page, limit, cb) {
        repo.getArtist(id, getOffset(page, limit), limit, (err, arrayResponses) => {
            if(err){
                return cb(err)
            }

            const artist = mapper.mapArtistAndAlbums(arrayResponses[0].json, arrayResponses[1].json)

            artist.expire = arrayResponses[0].lifetime < arrayResponses[1].lifetime ?
                arrayResponses[0].lifetime : arrayResponses[1].lifetime

            cb(null, artist)
        })
    }

    /**
     * Get an album info with tracks
     *
     * @param id
     * @param cb
     */
    this.albumInfo = function(id, cb) {
        repo.getAlbumInfo(id, (err, spotifyJsonResponse) => {
            if(err)
                return cb(err)

            const album = mapper.mapAlbum(spotifyJsonResponse.json)
            album.expire = spotifyJsonResponse.lifetime

            cb(null, album)
        })
    }

}

/*
|--------------------------------------------------------------------------
| Utils
|--------------------------------------------------------------------------
*/
/**
 * Convert a page number and limit items to an offset
 * Spotify API uses an offset integer
 *
 * @param page
 * @param limit
 * @return {number}
 */
function getOffset(page, limit) {
    if(page < 1) page = 1
    if(limit < 1) limit = 1
    if(limit > 20) limit = 20

    return --page * limit
}

module.exports = dataService
