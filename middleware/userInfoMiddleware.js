"use strict";

/**
 * Pass user info to the response, if authenticated
 * Middleware
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

    // user defined
    if (req.session.message) {
        res.locals.message = req.session.message
        delete req.session.message
    }

    next()
}