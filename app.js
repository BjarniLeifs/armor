/*
  Declare models to use. If new is added you will need to use
  for dependance : npm install nameOfModul --save
  for dev dependance : npm install nameOfModul --save-dev.
  Then you will need to use it where ever it is needed by declare
  var name = require('theModelName');
*/ 

/* Express declared. */
var express = require('express');
/* Path is used for path.join. It tells where specific paths are for the app to use. */
var path = require('path');
/* A favicon is a visual cue that client software, like browsers, use to identify a site */
var favicon = require('serve-favicon');
/* Logger for dev purpose */
var logger = require('morgan');
/* Work with cookies, this is to translate to and from cookie */
var cookieParser = require('cookie-parser');
/* For body msg. req.body.something... */
var bodyParser = require('body-parser');
/* Load the modern build */
var _ = require('lodash');

/* Load Json Web Token */
var jwt = require('jsonwebtoken');
/* Load express jwt, for authenticat checks of scopes and api calls */
var jwtCheck = require('express-jwt');
/* Loading secret configuration */
var config = require('./config/configuration');


/* SWAGGER Documentation */
var swagger = require("swagger-node-express");
var requirejs = require('requirejs');
/* Defining app as express server */
var app = express();
/* Configuring App sets and it's use */
/* swagger  subpath to use express */
var subpath = express();


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
/* Opening connection between app and subpath for swagger */
app.use("/", subpath);
/* 
  Telling express where static files are to use.
  Meaningstatic = all files used, js,css,html is located 
  in "public" folder and swagger uses "doc". 
 */
app.use(express.static(path.join(__dirname, 'doc')));
app.use(express.static(path.join(__dirname, 'public')));
/* Set swagger to be handled with subpath */
swagger.setAppHandler(subpath);
/* SWAGGER configuration */
swagger.configureSwaggerPaths('', '/api-docs', '');
/* Create connection to browser for http://url-path-hosted*on/doc and linking to html path */
app.get('/doc', function (req, res) {
    res.sendFile(__dirname + '/doc/swagger.html');
});

/* Configure the API domain to be displayed in terminal  */
var domain = 'localhost';
/* Configure the API port to be displayed in terminal */
var port = 3001;

/* Set and display the application URL */
var applicationUrl = 'http://' + domain + ':' + port + '/doc';
console.log('Documentation API is running on ' + applicationUrl);

swagger.configure(applicationUrl, '1.0.0');

/* 
  Defining that all API calls need to be authanticated.
  This is token security to ensure permission in the app 
  when someone calls for /api/.... 
 */
app.use('/api',jwtCheck({
  secret: config.secret,
  userProperty: config.payload
}));

requirejs.config({
    //Pass the top-level main.js/index.js require
    //function to requirejs so that node modules
    //are loaded relative to the top-level JS file.
    nodeRequire: require
});

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




/* Catch 404 and forward to error handler */
app.use(function (req, res, next) {
  var err = new Error('Not Found');
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



