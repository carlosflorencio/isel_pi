"use strict";

/**
 * JSON Entity with it's lifetime
 *
 * @param lifetime max lifetime of the json object
 * @param json json object
 * @constructor
 */
function JsonResponse(lifetime, json) {
    this.lifetime = lifetime;
    this.json = json;
}


module.exports = JsonResponse