/*
  Declare models to use. If new is added you will need to use
  for dependance : npm install nameOfModul --save
  for dev dependance : npm install nameOfModul --save-dev.
  Then you will need to use it where ever it is needed by declare
  const name = require('theModelName');
*/ 

/* Express declared. */
const express = require('express');
/* Path is used for path.join. It tells where specific paths are for the app to use. */
const path = require('path');
/* A favicon is a visual cue that client software, like browsers, use to identify a site */
const favicon = require('serve-favicon');
/* Logger for dev purpose */
const logger = require('morgan');
/* Work with cookies, this is to translate to and from cookie */
const cookieParser = require('cookie-parser');
/* For body msg. req.body.something... */
const bodyParser = require('body-parser');
/* Load the modern build */
const _ = require('lodash');

/* Load Json Web Token */
const jwt = require('jsonwebtoken');
/* Load express jwt, for authenticat checks of scopes and api calls */
const jwtCheck = require('express-jwt');
/* Loading secret configuration */
const config = require('./config/configuration');

/* Defining app as express server */
const app = express();
/* Configuring App sets and it's use */



/* View engine setup */
/* Make engine html use ejs render. */
app.engine('html', require('ejs').renderFile);

/* set path to views */

app.set('views', path.join(__dirname, 'public/views'));
app.set('view engine', 'html');

/* uncomment after placing your favicon in /public */
/* app.use(favicon(path.join(__dirname, 'public', 'favicon.ico'))); */

/* Loggin in dev mode */
app.use(logger('dev'));
/* Middleware to read/write and other of json object */
app.use(bodyParser.json());
/* Middleware to read/write and other of urlencoded things  */
app.use(bodyParser.urlencoded({ extended: false }));
/* Middleware to read/write and other things of cookies */
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));

/* 
  Defining that all API calls need to be authanticated.
  This is token security to ensure permission in the app 
  when someone calls for /api/.... 
 */
app.use('/api',jwtCheck({
  secret: config.secret,
  userProperty: config.payload
}));

/*   held þetta sé swagger
requirejs.config({
    //Pass the top-level main.js/index.js require
    //function to requirejs so that node modules
    //are loaded relative to the top-level JS file.
    nodeRequire: require
});
*/
/* 
  ROUTES activated and telling app where the routes are  for "API" calls!

  Telling the app where to look for Helpers files that are used.  
  Telling the app where to look for API files that are used.  

  Used as followed --> app.use(require('./pathtoroutefile'));

  Other information about option
  If app.use('/api', require('./pathToRoute')); is used... talking about '/api'
  The app will put /api infront of the "router.get('/posts', function (req, res, next)" function 
  router.get('/api/posts', function (req, res, next)
  There for no need to add /api infront of all others in routeFiles! will be automatic
  Leading you to call the servies with /api/posts from the frontEnd to get response.  

*/


app.use('/auth',require('./routes/authentications'));

/* Catch 404 and forward to error handler */
app.use(function (req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

/* Error handlers */

/* 
  Development error handler 
  will print stacktrace 
*/
if (app.get('env') === 'development') {
  app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

/* 
  Production error handler 
  no stacktraces leaked to user 
*/
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

/* Exports the app. */
module.exports = app;


/*
  More logic about starting server, port and getting env configurations from cloud 
  If needed autmaticly hence the env configurations in nameOfApp/bin/www
*/



