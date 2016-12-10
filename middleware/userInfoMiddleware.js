"use strict";

/**
 * Pass user info to the response, if authenticated
 * Middleware
 *
 * Also add support for flash messages
 *
 * @param req
 * @param res
 * @param next
 */
module.exports = function (req, res, next) {
    if (req.isAuthenticated()) {
        res.locals.user = req.user
    }

    req.flash = function (message, type = 'info') {
        req.session.message = {message: message, type: type}
    }

    if (req.session.message) {
        res.locals.message = req.session.message
        delete req.session.message // the message is only valid for one request
    }

    next()
}