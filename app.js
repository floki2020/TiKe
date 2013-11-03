
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var http = require('http');
var path = require('path');
var settings=require('./settings');
var partials=require('express-partials');
var flash=require('connect-flash');
var app = express();

var MongoStore=require('connect-mongo')(express);
var sessionStore=new MongoStore({
    db:settings.db
},function(){
    console.log('connect mongodb success');
});

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
//app.use(app.router);
app.use(partials());
app.use(flash());
app.use(express.cookieParser());
app.use(express.session({
    secret:settings.session_secret,
    store:sessionStore,
    cookie:{
        maxAge:new Date(Date.now()+1000*60*60)
    }
}));

app.use(express.static(path.join(__dirname, 'public')));

app.use(function (req, res, next) {
    res.locals.error = req.flash('error');
    res.locals.success = req.flash('success');
    res.locals.user = req.session.user;
    next();
});
// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

//routes
routes(app);

app.locals({
    config:settings,
    title:settings.name
});
http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
