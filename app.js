const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const hbs = require('hbs')
const viewService = require('./model/service/viewService')
const bodyParser = require('body-parser');

const app = express();

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
*/
const index = require('./routes/index');
const artists = require('./routes/artists');
const albums = require('./routes/albums');


/*
|--------------------------------------------------------------------------
| View engine setup
|--------------------------------------------------------------------------
*/
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
viewService(hbs)


/*
|--------------------------------------------------------------------------
| Middlewares
|--------------------------------------------------------------------------
*/
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
//app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Our middlewares
app.use('/', index);
app.use('/artists', artists);
app.use('/albums', albums);


/*
|--------------------------------------------------------------------------
| Catch 404 and send the view
|--------------------------------------------------------------------------
*/
app.use(function(req, res, next) {
  res.status(404).render('error/404', {title: '404'})
});

/*
|--------------------------------------------------------------------------
| Error handler, send error view
|--------------------------------------------------------------------------
*/
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error/500', {title: "Error"});
});


module.exports = app;
