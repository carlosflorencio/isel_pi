const Factory = require('../../model/serviceFactory')

/*
 |--------------------------------------------------------------------------
 | Validation middlewares for the Ajax routes
 |--------------------------------------------------------------------------
 */

/**
 * Validate if the user is logged
 * The user should send the cookies via ajax, then the passport should auth
 * the user automatically, if this does not happen we send an error
 *
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
module.exports.needsLogin = function(req, res, next) {
    if(req.isAuthenticated())
        return next()

    res.ajaxError('You need to login', 401)
}
