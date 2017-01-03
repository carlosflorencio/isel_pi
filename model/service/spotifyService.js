"use strict";

const mapper = require('./../mapper/spotifyMapperService')

/**
 * Data Service is used to help retrieve data from a repository and map it into a model entity
 * All returned entities have a property with the expire time from spotify
 * @param repo repository of the data
 */
function DataService(repo) {

    /**
     * Search Artist using Spotify data
     *
     * @param name
     * @param page
     * @param limit
     * @returns {Promise} Collection of Artists
     */
    this.searchArtist = function (name, page, limit) {
        return new Promise((resolve, fail) => {
            repo.searchArtist(name, getOffset(page, limit), limit, (err, spotifyJsonResponse) => {
                if (err) return fail(err)

                const collection = mapper.mapArtistsToCollection(spotifyJsonResponse.json)
                collection.expire = spotifyJsonResponse.lifetime

                resolve(collection)
            })
        })
    }

    /**
     * Get Artist and his Albums
     * 2 paralel requests
     *
     * @param id
     * @param page
     * @param limit
     * @returns {Promise} Artist
     */
    this.getArtistInfoWithAlbums = function (id, page, limit) {
        return new Promise((resolve, fail) => {
            repo.getArtist(id, getOffset(page, limit), limit, (err, arrayResponses) => {
                if (err) return fail(err)

                const artist = mapper.mapArtistAndAlbums(arrayResponses[0].json, arrayResponses[1].json)
                artist.expire = Math.min(arrayResponses[0].lifetime, arrayResponses[1].lifetime)

                resolve(artist)
            })
        })
    }

    /**
     * Get an album info with 50 tracks
     *
     * @param id
     * @returns {Promise} Album
     */
    this.albumInfo = function (id) {
        return new Promise((resolve, fail) => {
            repo.getAlbumInfo(id, (err, spotifyJsonResponse) => {
                if (err) return fail(err)

                const album = mapper.mapAlbum(spotifyJsonResponse.json)
                album.expire = spotifyJsonResponse.lifetime

                resolve(album)
            })
        })
    }

    /**
     * Get Album info with tracks paginated
     * 2 paralel requests
     *
     * @param id
     * @param page
     * @param limit
     * @returns {Promise} Album
     */
    this.albumTracks = function (id, page, limit) {
        return new Promise((resolve, fail) => {
            repo.getAlbumTracksParalelWithAlbumInfo(id, getOffset(page, limit), limit, (err, arrayResponses) => {
                if (err) return fail(err)

                const album = mapper.mapAlbum(arrayResponses[0].json)
                album.tracks = mapper.mapTracksToCollection(arrayResponses[1].json)
                album.expire = Math.min(arrayResponses[0].lifetime, arrayResponses[1].lifetime)

                resolve(album)
            })
        })
    }

    /**
     * Get tracks from an array of ids
     *
     * @param idsArray
     * @returns {Promise} Tracks Array
     */
    this.getTracks = function (idsArray) {
        return new Promise((resolve, fail) => {
            repo.getMultipleTracks(idsArray, (err, spotifyJsonResponse) => {
                if (err) return fail(err)

                const tracks = spotifyJsonResponse.json.tracks.map(t => mapper.mapTrack(t))
                tracks.expire = spotifyJsonResponse.lifetime

                resolve(tracks)
            })
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
    if (page < 1) page = 1
    if (limit < 1) limit = 1
    if (limit > 20) limit = 20

    return --page * limit
}

module.exports = DataService
