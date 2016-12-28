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
 * If couchdb returns an error, the callback is called with
 * callback(null, false), usefull for when a document does not exist
 *
 * @param callback
 */
module.exports.bodyCallback = function (callback) {
    return (err, res) => {
        if (err) return callback(err)

        if (res.body.error) return callback(null, false)

        return callback(null, res.body)
    }
}
