"use strict";

const fs = require('fs');

const SpotifyJsonResponse = require('../model/entity/SpotifyJsonResponse')

const filePath = __dirname + '/files/'

const repo = {}

repo.searchArtist = function (artist, offset, limit, cb) {
    fs.readFile(filePath+'SearchPinkFloyd.json', (err, data) => {
        if(err){
            return cb(err)
        }
        const json = JSON.parse(data)
        const jsonResponse = new SpotifyJsonResponse(
            null,   //TODO
            JSON.stringify(json.data),
            json.lifetime
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
        const json = JSON.parse(data)
        arr[0] = new SpotifyJsonResponse(
            null,
            JSON.stringify(json.data),
            json.lifetime
        )

        fs.readFile(filePath+'AlbumsPinkFloyd.json', (err, data) => {
            if(err){
                return cb(err)
            }
            const json = JSON.parse(data)
            arr[1] = new SpotifyJsonResponse(
                null,   //TODO
                JSON.stringify(json.data),
                json.lifetime
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
        const json = JSON.parse(data)
        const jsonResponse = new SpotifyJsonResponse(
            null,   //TODO
            JSON.stringify(json.data),
            json.lifetime
        )

        cb(null, jsonResponse)
    })
}

module.exports = repo