"use strict";

/*
|--------------------------------------------------------------------------
| Couchdb Helpers & callbacks
|--------------------------------------------------------------------------
*/
/**
 * Search Callback
 * Returns the first document of an array of documents
 *
 * If no results, callback is called with (null, false)
 *
 * @param callback
 * @return {function(*=, *)}
 */
module.exports.searchCallback = function(callback) {
    return (err, res) => {
        if (err) return callback(err)

        if (res.body.docs.length == 1) { // the doc we want
            return callback(null, res.body.docs[0])
        }

        // no results
        return callback(null, false)
    }
}

/**
 * Body callback
 * Gets the body of the couchdb document
 *
 * @param callback
 * @returns {function(*=, *)}
 */
module.exports.bodyCallback = function (callback) {
    return (err, res) => {
        if (err) return callback(err)

        return callback(null, res.body)
    }
}
