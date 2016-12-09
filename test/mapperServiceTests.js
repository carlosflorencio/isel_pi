"use strict";

const assert = require('assert')
const fs = require('fs')

const Artist = require('../model/entity/Artist')
const Collection = require('../model/entity/Collection')
const Album = require('../model/entity/Album')
const Track = require('../model/entity/Track')

const path = __dirname + "/files/"

const jsonAlbums = JSON.parse(fs.readFileSync(path + 'AlbumsPinkFloyd.json')).data
const jsonAlbum = JSON.parse(fs.readFileSync(path + 'AlbumTheEndlessRiverPinkFloyd.json')).data
const jsonTracks = jsonAlbum.tracks
const jsonTrack = jsonTracks.items[0]
const jsonArtist = JSON.parse(fs.readFileSync(path + 'ArtistPinkFloyd.json')).data
const jsonArtists = JSON.parse(fs.readFileSync(path + 'SearchPinkFloyd.json')).data

const mapperService = require('../model/service/spotifyMapperService')

describe('Mapper Service', function() {

    describe('#mapTrack()', function() {
        it('Should be instaceof Track', function (done) {
            const track = mapperService.mapTrack(jsonTrack)

            assert(track instanceof Track)
            done()
        })

        it('Should map a Track Correctly', function (done) {
            const track = mapperService.mapTrack(jsonTrack)
            assertTrack(track, jsonTrack)
            done()
        })
    })

    describe('#mapAlbum()', function() {
        it('Should be instaceof Album', function (done) {
            const album = mapperService.mapAlbum(jsonAlbum)

            assert(album instanceof Album)
            done()
        })

        it('Should map an Album Correctly', function (done) {
            const album = mapperService.mapAlbum(jsonAlbum)

            assertAlbum(album, jsonAlbum)
            assert.equal("https://i.scdn.co/image/0d4597dcaff96fd0c8cad3819b7e0c12dda043ff", album.image)

            //tracks is a Collection of Tracks
            assert.equal(jsonTrack.id, album.tracks.items[0].id)

            done()
        })
    })

    describe('#mapArtistsToCollection()', function() {
        it('Should be instanceof Collection with items instanceof Artist', function (done) {
            const artists = mapperService.mapArtistsToCollection(jsonArtists)

            assert(artists instanceof Collection)
            assert(artists.items[0] instanceof Artist)
            done()
        })

        it('Should map json to Collection of Artists', function (done) {
            const artists = mapperService.mapArtistsToCollection(jsonArtists)

            for(let i = 0; i<artists.items.length; i++){
                assertArtist(artists.items[i], jsonArtists.artists.items[i])
                assert(!artists.items[i].albums)
            }
            done()
        })

    })

    describe('#mapAlbumsToCollection()', function() {
        it('Should be instanceof Collection with Albums', function (done) {
            const albums = mapperService.mapAlbumsToCollection(jsonAlbums)

            assert(albums instanceof Collection)
            assert(albums.items[0] instanceof Album)
            done()
        })

        it('Should map several albums to a collection', function (done) {
            const albums = mapperService.mapAlbumsToCollection(jsonAlbums)

            for (let i = 0; i<albums.items.length; i++){
                assertAlbum(albums.items[i], jsonAlbums.items[i])
                assert(!albums.items[i].tracks)
            }

            done()
        })
    })

    describe('#mapArtistAndAlbums()', function() {
        it('Should be instanceof Artist with Albums', function (done) {
            const artist = mapperService.mapArtistAndAlbums(jsonArtist, jsonAlbums)

            assert(artist instanceof Artist)
            assert(artist.albums)
            assert(artist.albums.items[0] instanceof Album)
            done()
        })

        it('Should map an Artist Completely(with albums)', function (done) {
            const artist = mapperService.mapArtistAndAlbums(jsonArtist, jsonAlbums)

            assertArtist(artist, jsonArtist)
            for (let i = 0; i<jsonAlbums.items.length; i++){
                assertAlbum(artist.albums.items[i], jsonAlbums.items[i])
            }
            done()
        })
    })

    describe('#mapTracksToCollection()', function() {
        it('Should be instanceof Collection with Tracks', function (done) {
            const tracks = mapperService.mapTracksToCollection(jsonTracks)

            assert(tracks instanceof Collection)
            assert(tracks.items[0] instanceof Track)
            done()
        })

        it('Should map to a Collection of Tracks', function (done) {
            const tracks = mapperService.mapTracksToCollection(jsonTracks)

            for (let i = 0; i<tracks.items.length; i++){
                assertTrack(tracks.items[i], jsonTracks.items[i])
            }
            done()
        })
    })

    describe('#mapArtist()', function() {
        it('Should be instanceof Artist', function (done) {
            const artist = mapperService.mapArtist(jsonArtist)

            assert(artist instanceof Artist)
            assert(!artist.albums)
            done()
        })

        it('Should map to an Artist', function (done) {
            const artist = mapperService.mapArtist(jsonArtist)

            assertArtist(artist, jsonArtist)
            assert(!artist.albums)
            done()
        })
    })


})

/**
 * checks if the two arguments are equal
 *
 * @param artist object Artist
 * @param jsonArtist josn object representing an Artist
 */
function assertArtist(artist, jsonArtist) {
    assert.equal(jsonArtist.id, artist.id)
    assert.equal(jsonArtist.name, artist.name)
    assert.deepEqual(jsonArtist.genres, artist.genres)
    assert.equal(jsonArtist.popularity, artist.popularity)
    assert.equal(jsonArtist.uri, artist.uri)
    assert.equal(jsonArtist.followers.total, artist.followers)
}

/**
 * checks if the two arguments are equal
 *
 * @param album object Album
 * @param jsonAlbum json object representing an Album
 */
function assertAlbum(album, jsonAlbum) {
    assert.equal(jsonAlbum.id, album.id)
    assert.equal(jsonAlbum.name, album.name)
    assert.equal(jsonAlbum.uri, album.uri)
    assert.equal(jsonAlbum.label, album.label)
    assert.equal(jsonAlbum.release_date, album.release_date)
}

/**
 * checks if the two arguments are equal
 *
 * @param track object Track
 * @param jsonTrack json object representing a Track
 */
function assertTrack(track, jsonTrack) {
    assert.equal(jsonTrack.id, track.id)
    assert.equal(jsonTrack.name, track.name)
    assert.equal(jsonTrack.disk_number, track.disk)
    assert.equal(jsonTrack.duration_ms, track.duration)
    assert.equal(jsonTrack.preview_url, track.previewUrl)
    assert.equal(jsonTrack.track_number, track.track_number)
    assert.equal(jsonTrack.uri, track.uri)
}

