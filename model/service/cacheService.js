"use strict";

const fs = require('fs')
const path = require('path')

const INFINITE = 'infinite'

/**
 * Cache Service
 * This cache has two levels: memory and disk fallback
 * Works for all type of values
 * Also has expiration for the values if provided
 * Warning: complexity inside
 *
 * TODO: clear cache method
 * TODO: add a routine to clear expired cache files after some tome
 * TODO: add option to only use memory cache?
 * TODO: export this to a standalone package to npm with the cache middleware helper
 *
 * @param cacheDir Directory to save the cached values in disk
 * @param fileExt ex: 'json'(default), 'txt'
 * @constructor
 */
function Cache(cacheDir, fileExt = 'json') {
    // Cache n1 - Memory
    this._memory = {}

    this._cacheDir = cacheDir
    this._cacheExt = '.' + fileExt
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
    const cacheObject = this._memory[key]

    if(cacheObject) { // The value is in memory
        if(cacheObject.isExpired()) {
            delete this._memory[key] // remove from memory

            // delete the file if it exists (async)
            this.deleteFile(key)

            return this.valueIsNotInCache(cb)
        }

        return cb(null, cacheObject.value)
    }

    // not in memory, lets try using the disk
    this.loadFromDisk(key, (cacheObject) => {
        if(cacheObject) { // Exists in disk!
            if(cacheObject.isExpired()) { // EXPIRED! remove from disk
               this.deleteFile(key)  // delete the file (async)
                return this.valueIsNotInCache(cb)
            }

            if(cacheObject.expire != INFINITE) {
                cacheObject.timeout = setTimeout(() => { // add timeout again
                    this.delete(key)
                }, cacheObject.expire - Date.now()); // align the timout
            }

            this._memory[key] = cacheObject //add to memory again
            return cb(null, cacheObject.value)
        }

        return this.valueIsNotInCache(cb) // not in disk
    })
}

/**
 * Add a value to cache
 * Value is added in memory cache and in disk
 * Expiration can be provided, is optional
 * When expired, is removed from the memory & disk (setTimeout is used)
 *
 * If no callback was passed, the value is return
 * otherwise the callback is called with finished writing to the disk
 *
 * TODO: validate key for a valid filename and expire for valid time
 *
 * @param key
 * @param value
 * @param expire OPTIONAL: miliseconds
 * @param cb OPTIONAL: (error|null) Called when finished writing the file in disk
 * error: writing failed, null: writing succeded
 */
Cache.prototype.put = function(key, value, expire = INFINITE, cb = null) {
    const oldRecord = this._memory[key];
    if (oldRecord) { // clear old value timeout
        if(oldRecord.expire != INFINITE)
            clearTimeout(oldRecord.timeout);
    }

    const cachedObject = new CacheObject(value, expire != INFINITE ? Date.now() + expire : INFINITE)

    if(expire != INFINITE) {
        cachedObject.timeout = setTimeout(() => { // remove from cache after expire time
            this.delete(key)
        }, expire);
    }

    this._memory[key] = cachedObject // memory n1

    fs.writeFile(this.getCachePath(key), cachedObject.toJson(), (err) => {
        if(err) {
            if(cb) return cb(err)

            // not important for the runtime of the app, the value is in memory
            console.log('Failed to write in cache: ' + err.message);
            return
        }

        if(cb) return cb(null) // success
    })

    if(!cb)
        return value
}


/**
 * Remove value from cache
 * Deletes from memory and disk
 *
 * @param key
 */
Cache.prototype.delete = function(key) {
    const cachedObject = this._memory[key]

    if(cachedObject) { // clear timeout
        if(cachedObject.expire != INFINITE)
            clearTimeout(cachedObject.timeout)
    }
    
    delete this._memory[key] // remove from memory

    this.deleteFile(key) // async
}

/**
 * Loads the Cached Object from disk
 *
 * @param key
 * @param cb (result) result can be false or the cachedObject
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
Cache.prototype.valueIsNotInCache = function(callback) {
    callback(new Error("Value is not in cache."))
}

/**
 * Constructs the cache dir path
 *
 * @param name
 * @return {string}
 */
Cache.prototype.getCachePath = function(name) {
    return path.join(this._cacheDir, name + this._cacheExt)
}

/**
 * Delete file async
 *
 * @param key
 */
Cache.prototype.deleteFile = function (key) {
    // delete the file if it exists (async)
    fs.unlink(this.getCachePath(key), (err) => {
        if(err) // no problem if file does not exist
            return console.log("Failed to delete file: " + err.message);
    })
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
    if(this.expire == INFINITE) return false

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
    return new CacheObject(data.value, data.expire == INFINITE ? INFINITE : parseInt(data.expire));
};

module.exports = Cache
module.exports.INFINITE = INFINITE