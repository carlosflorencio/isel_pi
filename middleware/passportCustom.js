const passport = require('passport')
const PassportStrategy = require('passport-local').Strategy
const Factory = require('../model/serviceFactory')

const playlistService = Factory.playlistService
const userService = Factory.userService
const inviteService = Factory.inviteService


/*
|--------------------------------------------------------------------------
| Strategy
|--------------------------------------------------------------------------
*/
let localStrategy = new PassportStrategy({
    usernameField: 'email',
    passwordField: 'password'
}, (username, password, done) => {

    userService.find(username, password, (err, user) => {
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
    cb(null, user.id)
})

/*
|--------------------------------------------------------------------------
| Deserialize
|--------------------------------------------------------------------------
*/
passport.deserializeUser((userId, cb) => {
    userService.findById(userId, (err, user) => {
        if(err) return cb(err)

        // only occurs if the user is deleted from the db
        if(!user) return cb(new Error("User not found!"))

        cb(null, user)

        // let count = 0
        // const total = 2
        //
        // // Load all invites to the user obj present in all requests
        // playlistService.playlistsOfUser(userId, (err, playlists) => {
        //     if(err) return cb(err)
        //
        //     user.playlists = playlists
        //     if(++count == total)
        //         return cb(err, user)
        // })
        //
        // // Load all invites to the user obj present in all requests
        // inviteService.getInvitations(user.email, (err, invites) => {
        //     if(err) return cb(err)
        //
        //     user.invites = invites
        //     if(++count == total)
        //         return cb(err, user)
        // })

        // Invites & Playlist are not really necessary in all requests,
        // but usefull to show the count badges in the topbar
        // for top performance we should remove or cache this
    })
})


module.exports = passport