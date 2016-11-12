"use strict";

const fs = require('fs');

const SpotifyJsonResponse = require('../src/model/entity/SpotifyJsonResponse')

const filePath = __dirname + '/files/'

const repo = {}

repo.searchArtist = function (artist, offset, limit, cb) {
    fs.readFile(filePath+'SearchPinkFloyd.json', (err, data) => {
        if(err){
            return cb(err)
        }
        const jsonResponse = new SpotifyJsonResponse(
            null,   //TODO
            data,
            null    //TODO
        )

        cb(null, jsonResponse)
    })
}

repo.getArtist = function (id, offset, limit, cb) {
    const arr = []
    fs.readFile(filePath+'ArtistPinkFloyd.json', (err, data) => {
        if(err){
            return cb(err)
        }
        arr[0] = new SpotifyJsonResponse(
            null,   //TODO
            data,
            null    //TODO
        )

        fs.readFile(filePath+'AlbumsPinkFloyd.json', (err, data) => {
            if(err){
                return cb(err)
            }
            arr[1] = new SpotifyJsonResponse(
                null,   //TODO
                data,
                null    //TODO
            )

            cb(null, arr)
        })
    })
}

repo.getAlbumInfo = function (id, cb) {
    fs.readFile(filePath+'AlbumTheEndlessRiverPinkFloyd.json', (err, data) => {
        if(err){
            return cb(err)
        }
        const jsonResponse = new SpotifyJsonResponse(
            null,   //TODO
            data,
            null    //TODO
        )

        cb(null, jsonResponse)
    })
}

module.exports = repo