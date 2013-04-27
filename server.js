var http     = require('http');
var express  = require('express');
var app      = express();
var getDb    = require('mongo-getdb');
var docs     = require('./lib/docs');
var passport = require('passport');

getDb.init({url: 'mongodb://bootcamp:Pablo77@ds045077.mongolab.com:45077/bootcamp-pablo'});


require('./lib/setupPassport');

app.configure(function (){
  this.set("view engine", "jade");
  this.set("views", __dirname + "/views");
  this.use(express.bodyParser());
  this.use(express.static(__dirname + '/public'));
  this.use(express.cookieParser());
  this.use(express.bodyParser());
  this.use(express.session({ secret: 'keyboard cat' }));
  this.use(passport.initialize());
  this.use(passport.session());
  
  this.use(function (req, res, next) {
    res.locals.user = req.user;
    res.locals.env = process.env;
    next();
  });

  this.use(app.router);

});

app.get('/', function (req, res) {
  docs.find(req.query.search, req.user, function (err, docs) {
    if (err) return res.send(500, err);
    res.render('home', {
      docs: docs
    });
  });
});

//create a new document and redirect to the edit page.  
app.get('/new', function (req, res) {
  docs.createNew(req.user, function (err, id) {
    if (err) return res.send(500, err);
    res.redirect('/doc/' + id);
  });
});

//render the document
app.get('/doc/:id', function (req, res) {
  docs.getById(req.params.id, req.user, function (err, doc) {
    if (err) return  res.send(500);
    if (!doc) return res.send(404);
    res.render('doc', {
      doc: doc
    });
  });
});

//save the document content
app.patch('/doc/:id', function (req, res) {
  docs.save(req.params.id, req.body, req.user, function (err, count) {
    if (err) return res.send(500);
    if (count === 0) return res.send(404);
    res.send(200);
  });
});

//Callback handler
app.get('/callback', 
  passport.authenticate('auth0', { failureRedirect: '/authfailure' }), 
  function(req, res) {
    if (!req.user) {
      throw new Error('user null');
    }
    res.redirect("/");
  }
);

//Authentication error handler
app.get('/authfailure', function (req, res) {
  res.send('Authentication failed');
});

//Logout
app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

//Login
app.get('/login', 
  passport.authenticate('auth0', { connection: 'google-oauth2' }), 
  function (req, res) {
    res.redirect("/");
  });

http.createServer(app)
    .listen(8080, function () {
      console.log('listening on http://localhost:8080');
    });