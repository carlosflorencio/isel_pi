const express = require('express')
const router = express.Router()
const passport = require('passport')
const guest = require('connect-ensure-login').ensureNotAuthenticated
const userRepo = require('../data/UsersRepository')
const DataService = require('../model/service/userService')

const dataService = new DataService(userRepo)

/*
|--------------------------------------------------------------------------
| Login
|--------------------------------------------------------------------------
*/
/**
 * Login page
 *
 * If authenticated user access this page, will be redirected to home
 */
router.get('/login', guest(), function (req, res, next) {
    res.render('user/login', {title: 'Login'});
})

/**
 * Verify user using passport
 * TODO: Validate all input fields
 */
router.post('/login', function (req, res, next) {
    passport.authenticate('local', function (err, user, info) {
        if (err) return next(err)

        if (!user)  {
            req.flash('Wrong credentials!', 'danger')
            res.redirect('back')
            return
        }

        req.logIn(user, function (err) {
            if (err) return next(err)

            req.flash('Welcome back ' + user.name + '!')
            return res.redirect('/');
        })
    })(req, res, next);
})


/*
|--------------------------------------------------------------------------
| Register
|--------------------------------------------------------------------------
*/
/**
 * Register page
 */
router.get('/register', guest(), function (req, res, next) {
    res.render('user/register', {title: 'Register'});
})


/**
 * Register logic
 *
 * Create a new user if the email is not registered already
 *
 * TODO: Validate all fields
 */
router.post('/register', function (req, res, next) {

    if(!req.body.name || !req.body.email || !req.body.password) {
        req.flash('You need to fill all the data!', 'danger')
        res.redirect('back')
        return
    }

    dataService.findByEmail(req.body.email, (err, user) => {
        if(err) return next(err)

        if(user) {
            req.flash('That email is already registered!', 'danger')
            res.redirect('back')
            return
        }

        // create a new user
        dataService.create(req.body.email,req.body.password, req.body.name, (err, user) => {
            if(err) return next(err)

            // login the new user
            req.logIn(user, function (err) {
                if (err) return next(err)

                req.flash('Welcome ' + req.body.name + ', you are now registered!')
                return res.redirect('/');
            })
        })
    })
})


/*
|--------------------------------------------------------------------------
| Logout
|--------------------------------------------------------------------------
*/
/**
 * Logout user
 */
router.get('/logout', function(req, res){
    req.logout();
    res.redirect('/');
});

module.exports = router;