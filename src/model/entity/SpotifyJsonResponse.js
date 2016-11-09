"use strict";

/**
 * Spotify JSON Entity
 * Contains the json response string along with some
 * important response headers like cache controll (lifetime)
 *
 * @param lifetime max lifetime of the json object
 * @param json json object
 * @constructor
 */
function SpotifyJsonResponse(json, lifetime) {
    this.json = JSON.parse(json);
    this.lifetime = lifetime;
}


module.exports = SpotifyJsonResponse