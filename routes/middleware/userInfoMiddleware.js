"use strict";

/**
 * Middleware
 * Puts the user obj in the response, if authenticated
 *
 * Also adds support for flash messages
 * And redirect helpers
 * And ajax helpers
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

    res.backWithError = function (message) {
        if(req.xhr) // validation middlewares ajax response
            return res.ajaxError(message)

        return redirectWithMessage(req, res, 'back', message, 'danger')
    }

    res.redirectWithMessage = function (to, message, type = 'info') {
        return redirectWithMessage(req, res, to, message, type)
    }

    res.ajaxError = function (message, code = 400) { // helper to format error json response
        return res.status(code).json({error: message})
    }

    res.ajaxResponse = function (response) { // helper to format json response
        return res.json({data: response})
    }

    res.locals.currentPath = req.path // usefull to mark active page in the navbar

    next()
}

/*
|--------------------------------------------------------------------------
| Helper
|--------------------------------------------------------------------------
*/
function redirectWithMessage(req, res, to, message, type = 'danger') {
    req.flash(message, type)
    return res.redirect(to)
}