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
     * Also can send a body with the request
     *
     * @param path
     * @param method
     * @param body
     * @returns Promise (json) the server will always respond with json
     */
    this.fetch = function (path, method = 'GET', body = null) {
        let options = {
            method: method,
            credentials: 'same-origin', // send cookies
            headers: {
                'Content-Type': 'application/json', // when sending the body, should be json
                'X-Requested-With': 'XMLHttpRequest' // express needs to know, to see this as an ajax request
            }
        }

        if(body)
            options.body = JSON.stringify(body)

        return fetch(API_PATH + path, options).then(fetchResponse)
    }

    /*
    |--------------------------------------------------------------------------
    | Notifications
    |--------------------------------------------------------------------------
    */
    this.notifySuccess = function (message) {
        return alertify.success(message);
    }

    this.notifyInfo = function (msg) {
        return alertify.message(msg);
    }

    this.notifyError = function (message) {
        let m = message
        if(message instanceof Error)
            m = message.message // get the error message

        return alertify.error(m);
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
            .then(json => { // server always sends an error property when something is wrong
                throw new Error(json.error);
            })
    }


    return response.json()
}
