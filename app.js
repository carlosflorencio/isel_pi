const express = require('express')
const path = require('path')
const favicon = require('serve-favicon')
const logger = require('morgan')
const hbs = require('hbs')
const session = require('express-session')
const SessionFileStore = require('session-file-store')(session)
const viewService = require('./model/service/viewService')
const bodyParser = require('body-parser')
const passportWithStrategy = require('./routes/middleware/passportCustom')
const userInfoMiddleware = require('./routes/middleware/userInfoMiddleware')
const globalLog = require('global-request-logger');

const app = express()

// Log all external requests, for debug purposes. Remove on production!
globalLog.initialize();
globalLog.on('success', function (request, response) {
    console.log('\x1b[36m%s\x1b[0m', `OUT [${request.method}] ${request.host}:${request.port}${request.path}`);
});
// if we dont catch, an exception is thrown, just for debug purposes!
globalLog.on('error', function (request, response) {
});
/*
 |--------------------------------------------------------------------------
 | Load our custom Routes
 |--------------------------------------------------------------------------
 */
const index = require('./routes/index')
const artists = require('./routes/artists')
const albums = require('./routes/albums')
const users = require('./routes/users')
const playlists = require('./routes/playlists')
const invites = require('./routes/invites')
const ajax = require('./routes/api/ajax')


/*
 |--------------------------------------------------------------------------
 | View engine setup & App configuration
 |--------------------------------------------------------------------------
 */
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'hbs')
hbs.localsAsTemplateData(app)
viewService(hbs) // configure hbs


/*
 |--------------------------------------------------------------------------
 | App Global Middlewares
 |--------------------------------------------------------------------------
 */
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))
app.use(logger('dev'))
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(express.static(path.join(__dirname, 'public')))
app.use(session({
    store: new SessionFileStore({ // sessions are stored in the filesystem
        path: path.join(__dirname, 'storage/sessions')
    }),
    secret: 'spotie app secret', // make a more secure secret
    resave: true,
    saveUninitialized: false,
    name: "spotie", // cookie name
    cookie: {maxAge: 24 * 60 * 60 * 1000} //24 hours, ms
}));
app.use(passportWithStrategy.initialize())
app.use(passportWithStrategy.session())
app.use(userInfoMiddleware)


/*
 |--------------------------------------------------------------------------
 | Custom Routes
 |--------------------------------------------------------------------------
 */
app.use('/', index)
app.use('/artists', artists)
app.use('/albums', albums)
app.use('/user', users)
app.use('/playlists', playlists)
app.use('/invites', invites)
app.use('/api', ajax)


/*
 |--------------------------------------------------------------------------
 | Catch 404 and send the view
 |--------------------------------------------------------------------------
 */
app.use(function (req, res, next) {
    res.status(404)

    if (req.xhr) { // ajax, we need to respond with json
        return res.json({error: "Page not found."})
    }

    res.status(404).render('error/404', {title: '404'})
})

/*
 |--------------------------------------------------------------------------
 | Error handler, send error view
 |--------------------------------------------------------------------------
 */
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message
    res.locals.error = req.app.get('env') === 'development' ? err : {}

    // log the error, usefull to debug ajax requests
    console.log(err)

    res.status(err.status || 500)

    if (req.xhr) { // ajax, we need to respond with json
        return res.json({error: "Page not found."})
    }

    res.render('error/500', {title: "Error"})
})


module.exports = app
