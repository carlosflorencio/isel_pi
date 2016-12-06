"use strict";

const fs = require('fs')

/**
 * Cache Service
 * This cache has two levels: memory and disk fallback
 * Also has expiration for the values
 *
 *
 * @param cacheDir Directory to save the cached values in disk
 * @constructor
 */
function Cache(cacheDir) {
    // Cache n1 - Memory
    this.memory = {}

    this.cacheDir = cacheDir
    this.cacheExt = '.json'
}

/**
 * Get a value from cache
 * Tries to find the value in memory cache (n1)
 * If not in memory, is loaded from disk
 *
 * If no value was found, the callback is called with an error
 *
 * @param key
 * @param cb (err, value)
 */
Cache.prototype.get = function(key, cb) {
    const cacheObject = this.memory[key]

    if(cacheObject) { // The value is in memory
        if(cacheObject.isExpired()) {
            this.deleteFromCache(key)
            return this.viewIsNotInCache(cb)
        }

        return cb(null, cacheObject.value)
    }

    // Lets try using the disk
    this.loadFromDisk(key, (cacheObject) => {
        if(cacheObject) { // Exists in disk!
            if(cacheObject.isExpired()) { // EXPIRED! remove from disk
                fs.unlink(this.getCachePath(key))
                return this.viewIsNotInCache(cb)
            }

            cachedObject.timeout = setTimeout(() => { // add timeout again
                this.deleteFromCache(key)
            }, cachedObject.expire - Date.now());

            this.memory[key] = cachedObject //add to memory again
            return cb(null, cacheObject.view)
        }

        return this.viewIsNotInCache(cb) // not in disk
    })
}

/**
 * Add a value to cache
 * Value is added in memory cache and in disk
 * When expired, is removed from the memory & disk (setTimeout is used)
 *
 * @param key
 * @param value
 * @param expire miliseconds
 */
Cache.prototype.put = function(key, value, expire) {
    const oldRecord = this.memory[key];
    if (oldRecord) { // clear old value timeout
        clearTimeout(oldRecord.timeout);
    }

    const cachedObject = new CacheObject(view, Date.now() + expire)

    cachedObject.timeout = setTimeout(() => { // remove from cache after expires
        this.deleteFromCache(key)
    }, expire);

    this.memory[key] = cachedObject // memory n1

    fs.writeFile(this.getCachePath(key), cachedObject.toJson(), (err) => { // disk cache
        if(err)  // Error not relevant to the well functioning of the app
            console.log(err.message)
    })

    return value
}

/**
 * Remove value from cache
 * Deletes from memory and disk
 *
 * @param key
 */
Cache.prototype.deleteFromCache = function(key) {
    delete this.memory[key] // remove from memory

    // Delete the file if it exists (async)
    fs.unlink(this.getCachePath(key))
}

/**
 * Loads the Cached Object from disk
 *
 * @param key
 * @param cb (result) result can false or the view string
 */
Cache.prototype.loadFromDisk = function(key, cb) {
    fs.readFile(this.getCachePath(key), (err, data) => {
        if(err)  // Failed to load? No exists? lets return false
            return cb(false)

        // load json object from file
        cb(CacheObject.fromJson(data.toString()))
    })
}

/**
 * Calls the callback and sends the error saying the value
 * is not in cache
 *
 * @param callback
 */
Cache.prototype.viewIsNotInCache = function(callback) {
    callback(new Error("Value is not in cache."))
}

/**
 * Constructs the cache view path
 *
 * @param name
 * @return {string}
 */
Cache.prototype.getCachePath = function(name) {
    return this.cacheDir + name + this.cacheExt
}

/*
|--------------------------------------------------------------------------
| Cache Object Entity
|--------------------------------------------------------------------------
*/
/**
 * Cache object
 *
 * @param value
 * @param expireTime in seconds
 * @constructor
 */
function CacheObject(value, expireTime) {
    this.value = value
    this.expire = expireTime
}

/**
 * Compares the object expire time with the actual time
 *
 * @return {boolean} true if the object is expired
 */
CacheObject.prototype.isExpired = function () {
    return this.expire < Date.now()
}

/**
 * Converts this object to a json string
 *
 * Usefull to save the object on the disk
 */
CacheObject.prototype.toJson = function() {
    return JSON.stringify({value: this.value, expire: this.expire});
};

/**
 * Creates a new object from a json string
 *
 * @param json
 * @return {CacheObject}
 */
CacheObject.fromJson = function(json) {
    const data = JSON.parse(json); // Parsing the json string
    return new CacheObject(data.value, parseInt(data.expire));
};

module.exports = Cache