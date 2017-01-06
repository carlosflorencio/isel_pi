"use strict";

/*
|--------------------------------------------------------------------------
| Global app object
|--------------------------------------------------------------------------
*/
const API_PATH = '/api'

function Spotie() {

    /**
     * Fetch path
     *
     * @param path
     * @returns Promise (json)
     */
    this.fetch = function (path) {
        return fetch(API_PATH + path, {
            credentials: 'same-origin', // send cookies
            headers: {'X-Requested-With': 'XMLHttpRequest'} // express needs to know, to response with json
        }).then(fetchResponse)
    }

    /**
     * Fetch, send body object as json
     *
     * @param method
     * @param path
     * @param body
     * @returns {*}
     */
    this.fetchSendJson = function(method, path, body) {
        return fetch(this.api + path, {
            method: method.toUpperCase(),
            body: JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest'
            },
            credentials: 'same-origin'
        }).then(fetchResponse)
    }

    this.notifySuccess = function (message) {
        return alertify.success(message);
    }

    this.notifyError = function (message) {
        return alertify.error(message);
    }
}

const spotie = new Spotie() // global object

/*
|--------------------------------------------------------------------------
| Helpers
|--------------------------------------------------------------------------
*/
/**
 * Helper fetch response
 *
 * The promise error is the json error from the server
 * @param response
 * @returns Promise
 */
function fetchResponse(response) {
    if (!response.ok) {
        return response.json()
            .then(function (json) {
                throw new Error(json.error);
            })
    }


    return response.json()
}

function stringToHtml(str) {
    const div = document.createElement('div')
    div.innerHTML = str
    return div.firstChild
}
