"use strict";

const fs = require('fs')

// TODO: test cache service and CacheObject

// Cache n1 - Memory
const memory = {}

const CACHE_DIR = './cache/'
const CACHE_EXT = '.txt'

const cache = {}

/**
 * Cache logic
 * Tries to find the view in memory cache (n1)
 * If not in memory the disk is used
 *
 * @param name
 * @param cb (err, view)
 */
cache.getCachedView = function(name, cb) {
    const cacheObject = memory[name]
    if(cacheObject) { // The view is in memory
        parseCacheObject(name, cacheObject, cb)
    } else { // Lets try using the disk
        loadFromDisk(name, (cacheObject) => {
            if(cacheObject != false) { // Exists in disk!
                memory[name] = cacheObject
                return parseCacheObject(name, cacheObject, cb)
            }

            // View not in disk!
            return viewIsNotInCache(cb)
        })
    }
}

/**
 * Add a view to cache
 * Added in memory cache and disk
 *
 * @param name
 * @param view string
 * @param expire seconds
 */
cache.addCachedView = function(name, view, expire) {
    const cachedObject = new CacheObject(view, getActualSeconds() + expire)

    memory[name] = cachedObject // memory n1

    fs.writeFile(getCachePath(name), cachedObject.toJson(), (err) => {
        if(err)     // Error not relevant to the well functioning of the app
            console.log(err.message)
    }) // disk n2
}

/**
 * Tests to see if the cacheObject is valid or not (expired)
 * and calls the callback with the correct response
 *
 * @param name
 * @param cacheObject
 * @param cb
 * @return {*}
 */
function parseCacheObject(name, cacheObject, cb) {
    if(cacheObject.isExpired() == false) {
        return cb(null, cacheObject.view)
    }

    // Expired view, remove it from cache and call the callback
    deleteFromCache(name)
    return viewIsNotInCache(cb)
}

/**
 * Remove from cache the view
 * Deletes from memory and disk
 *
 * @param name
 */
function deleteFromCache(name) {
    if(memory[name]) { // remove from array
        delete memory[name]
    }

    // Delete the file if it exists
    fs.unlink(getCachePath(name))
}

/**
 * Loads the Cached Object from disk
 *
 * @param name
 * @param cb (result) result can false or the view string
 */
function loadFromDisk(name, cb) {
    fs.readFile(getCachePath(name), (err, data) => {
        if(err)  // Failed to load? No exists? lets return false
            return cb(false)

        cb(CacheObject.fromJson(data.toString()))
    })
}

/**
 * Calls the callback and sends the error saying the view
 * is not in cache
 *
 * @param callback
 */
function viewIsNotInCache(callback) {
    callback("View is not in cache.")
}

/**
 * Constructs the cache view path
 *
 * @param name
 * @return {string}
 */
function getCachePath(name) {
    return CACHE_DIR + name + CACHE_EXT
}
/*
|--------------------------------------------------------------------------
| Cache Object
|--------------------------------------------------------------------------
*/
/**
 * Cache object for each view
 *
 * @param view
 * @param expireTime in seconds
 * @constructor
 */
function CacheObject(view, expireTime) {
    this.view = view
    this.expire = expireTime
}

/**
 * Compares the object expire time with the actual time
 *
 * @return {boolean} true if the object is expired
 */
CacheObject.prototype.isExpired = function () {
    return this.expire < getActualSeconds()
}

/**
 * Converts this object to a json string
 *
 * Usefull to save the object on the disk
 */
CacheObject.prototype.toJson = function() {
    return JSON.stringify({view: this.view, expire: this.expire});
};

/**
 * Creates a new object from a json string
 *
 * @param json
 * @return {CacheObject}
 */
CacheObject.fromJson = function(json) {
    const data = JSON.parse(json); // Parsing the json string
    return new CacheObject(data.view, parseInt(data.expire));
};

/**
 * Gets the actual seconds from 1 jan 1970
 *
 * @return {number}
 */
function getActualSeconds() {
    return Math.round(new Date().getTime() / 1000);
}

module.exports = cache