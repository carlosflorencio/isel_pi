const passport = require('passport')
const PassportStrategy = require('passport-local').Strategy
const userRepo = require('../../data/UsersRepository')
const DataService = require('../../model/service/userService')

const dataService = new DataService(userRepo)

/*
|--------------------------------------------------------------------------
| Strategy
|--------------------------------------------------------------------------
*/
let localStrategy = new PassportStrategy({
    usernameField: 'email',
    passwordField: 'password'
}, (username, password, done) => {

    dataService.find(username, password, (err, user) => {
        if (err) return done(err)
        if (!user) return done(null, false)

        return done(null, user)
    })

})

passport.use(localStrategy)

/*
|--------------------------------------------------------------------------
| Serialize
|--------------------------------------------------------------------------
*/
passport.serializeUser((user, cb) => {
    cb(null, user._id)
})

/*
|--------------------------------------------------------------------------
| Deserialize
|--------------------------------------------------------------------------
*/
passport.deserializeUser((userId, cb) => {
    dataService.findById(userId, (err, user) => {
        cb(err, user)
    })
})


module.exports = passport