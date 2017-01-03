"use strict";

const assert = require('assert')

const DataService = require('../model/service/spotifyService')
const dataService = new DataService(require('./MockRepository'))

const Artist = require('../model/entity/Artist')
const Collection = require('../model/entity/Collection')
const Album = require('../model/entity/Album')
const Track = require('../model/entity/Track')

describe('Data Service', function () {
    describe('#searchArtist()', function () {
        it('Should not return error', function () {
            return dataService.searchArtist('', 0, 5)
                .then(artist => {
                })
        })

        it('Should have type Collection and item type of Artist', function () {
            return dataService.searchArtist('', 0, 5)
                .then(data => {
                    assert(data instanceof Collection)
                    assert(data.items[0] instanceof Artist)
                })
        })

        it('Should have Pink Floyd, Pink Floyd Redux, The Pink Floyd Story in items', function () {
            return dataService.searchArtist('', 0, 5)
                .then(data => {
                    assert(data.items.length == 10)
                    assert.equal('Pink Floyd', data.items[0].name)
                    assert.equal('Pink Floyd Redux', data.items[1].name)
                    assert.equal('The Pink Floyd Story', data.items[2].name)
                })
        })
    })
    describe('#getArtistInfoWithAlbums()', function () {
        it('Should not return error', function () {
            return dataService.getArtistInfoWithAlbums('', 0, 5)
                .then(data => {
                })
        })

        it('Should have type Artist', function () {
            return dataService.getArtistInfoWithAlbums('', 0, 5)
                .then(data => {
                    assert(data instanceof Artist)
                })
        })

        it('Should Artist Pink Floyd', function () {
            return dataService.getArtistInfoWithAlbums('', 0, 5)
                .then(data => {
                    assert.equal('Pink Floyd', data.name)
                })
        })

        it('Should have lifetime 800(albums lifetime) instead of 7200(artist lifetime)', function () {
            return dataService.getArtistInfoWithAlbums('', 0, 5)
                .then(data => {
                    assert.equal(800, data.expire)
                })
        })
    })
    describe('#albumInfo()', function () {
        it('Should not return error', function () {
            return dataService.albumInfo('')
                .then(data => {
                })
        })

        it('Should have type Album with a Collection of Tracks', function () {
            return dataService.albumInfo('')
                .then(data => {
                    assert(data instanceof Album)
                    assert(data.tracks instanceof Collection)
                    assert(data.tracks.items[0] instanceof Track)
                })
        })

        it('Should Album The Endless River', function () {
            return dataService.albumInfo('')
                .then(data => {
                    assert.equal('The Endless River', data.name)
                })
        })
    })
})
