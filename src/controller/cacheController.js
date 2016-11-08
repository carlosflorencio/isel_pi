"use strict";

const memory = {}

function getArtist(id, offset, cb){
    if(!memory.id){
        cb(null, null)
    }
}

function put(){}

module.exports.fetchArtist = getArtist