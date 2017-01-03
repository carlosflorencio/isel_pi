const passport = require('passport')
const PassportStrategy = require('passport-local').Strategy
const Factory = require('../../model/serviceFactory')

const userService = Factory.userService

/*
|--------------------------------------------------------------------------
| Strategy
|--------------------------------------------------------------------------
*/
let localStrategy = new PassportStrategy({
    usernameField: 'email',
    passwordField: 'password'
}, (username, password, done) => {

    userService.find(username, password)
        .then(user => {
            if (!user) return done(null, false)

            return done(null, user)
        })
        .catch(done)

})

passport.use(localStrategy)

/*
|--------------------------------------------------------------------------
| Serialize
|--------------------------------------------------------------------------
*/
passport.serializeUser((user, cb) => {
    cb(null, user.id)
})

/*
|--------------------------------------------------------------------------
| Deserialize
|--------------------------------------------------------------------------
*/
passport.deserializeUser((userId, cb) => {
    userService.findById(userId)
        .then(user => {
            if(!user) return cb(new Error("User not found!"))

            cb(null, user)
        })
        .catch(cb)
})


module.exports = passport