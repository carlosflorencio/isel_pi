"use strict";

/**
 * Spotify JSON Entity
 * Contains the json response string along with some
 * important response headers like cache controll (lifetime)
 *
 * @param id unique path of the response
 * @param lifetime max lifetime of the json object
 * @param json json object
 * @constructor
 */
function SpotifyJsonResponse(id, json, lifetime) {
    this.id = id
    this.json = JSON.parse(json);
    this.lifetime = lifetime;
}


module.exports = SpotifyJsonResponse