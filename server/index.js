// If Heroku is NOT running, run on local computer and pull local info from setup.js
if (!process.env.CLIENT_ID) {
  // Note: index.js runs before setup.js (see server-dev script in package.json)
  var setup = require('./setup.js');
};

var express = require('express');
var bodyParser = require('body-parser');
var items = require('../db/');
var handler = require('./requestHandler.js');
var facebook = require('./facebook.js');
var passport = require('passport');

var port = process.env.PORT || 3000;

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static(__dirname + '/../react/dist'));

// for facebook passport authentication - don't move
app.use(express.session({ secret: 'rum ham' }));
app.use(express.cookieParser());
app.use(passport.initialize());
app.use(passport.session());

// for Home Component - from searchRecipes function
app.post('/searchRecipes', handler.searchRecipes);

// for AddRecipe Component - from handleSubmit function
app.post('/api/addRecipe', handler.addRecipe);

// for Nav Component - from getUsername function
app.get('/username', handler.getUsername);

// to verify login
app.get('/verifylogin', (req, res) => {
  res.send(req.user);
});

// facebook passport
app.get('/auth/facebook',
  passport.authenticate('facebook')
);

app.get('/auth/facebook/callback',
  passport.authenticate('facebook', { successRedirect: '/', failureRedirect: '/login' })
  // function(req, res) {
  //   // Successful authentication, redirect home.
  //   res.redirect('/');
  // });
);

app.get('/logout', function(req, res) {
  req.logout();
  // req.session.destroy();
  res.redirect('/');
});

app.post('/searchRecipes', handler.searchRecipes);

// to find all recipes for given user id
app.get('/getAllRecipes', handler.getUserRecipes);

//to load shopping list added by user
app.get('/getShoppingList', handler.getShoppingList);

app.get('/addToShoppingList', handler.addToShoppingList);

app.post('/getRecipeById', handler.getRecipeById);

app.listen(port, function() {
  console.log('listening on port '+ port + '!');
});
