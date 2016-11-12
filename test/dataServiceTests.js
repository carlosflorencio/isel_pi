"use strict";

var assert = require('assert')

const DataService = require('../src/model/service/dataService')
const dataService = new DataService(require('./MockRepository'))

const Artist = require('../src/model/entity/Artist')
const Collection = require('../src/model/entity/Collection')
const Album = require('../src/model/entity/Album')
const Track = require('../src/model/entity/Track')

describe('Data Service', function() {
    describe('#searchArtist()', function() {
        it('Should not return error', function(done) {
            dataService.searchArtist('', 0, 5, (err, data) => {
                assert.ifError(err)
                done()
            })
        })

        it('Should have type Collection and item type of Artist', function (done) {
            dataService.searchArtist('', 0, 5, (err, data) => {
                assert(data instanceof Collection)
                assert(data.items[0] instanceof Artist)
                done()
            })
        })

        it('Should have Pink Floyd, Pink Floyd Redux, The Pink Floyd Story in items', function (done) {
            dataService.searchArtist('', 0, 5, (err, data) => {
                assert(data.items.length == 10)
                assert.equal('Pink Floyd', data.items[0].name)
                assert.equal('Pink Floyd Redux', data.items[1].name)
                assert.equal('The Pink Floyd Story', data.items[2].name)
                done()
            })
        })
    })
    describe('#getArtistInfoWithAlbums()', function() {
        it('Should not return error', function(done) {
            dataService.getArtistInfoWithAlbums('', 0, 5, (err, data) => {
                assert.ifError(err)
                done()
            })
        })

        it('Should have type Artist', function (done) {
            dataService.getArtistInfoWithAlbums('', 0, 5, (err, data) => {
                assert(data instanceof Artist)
                done()
            })
        })

        it('Should Artist Pink Floyd', function (done) {
            dataService.getArtistInfoWithAlbums('', 0, 5, (err, data) => {
                assert.equal('Pink Floyd', data.name)
                done()
            })
        })

        it('Should have lifetime 800(albums lifetime) instead of 7200(artist lifetime)', function (done) {
            dataService.getArtistInfoWithAlbums('', 0, 5, (err, data) => {
                assert.equal(800, data.expire)
                done()
            })
        })
    })
    describe('#albumInfo()', function() {
        it('Should not return error', function(done) {
            dataService.albumInfo('', (err, data) => {
                assert.ifError(err)
                done()
            })
        })

        it('Should have type Album with a Collection of Tracks', function (done) {
            dataService.albumInfo('', (err, data) => {
                assert(data instanceof Album)
                assert(data.tracks instanceof Collection)
                assert(data.tracks.items[0] instanceof Track)
                done()
            })
        })

        it('Should Album The Endless River', function (done) {
            dataService.albumInfo('', (err, data) => {
                assert.equal('The Endless River', data.name)
                done()
            })
        })
    })
})
