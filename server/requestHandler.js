var express = require('express');
var request = require('request');
var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

var db = require("../db/index.js");

// for Home Component - from searchRecipes function
exports.searchRecipes = function(req, res) {
  var searchTerm = req.body.searchTerm;
  // regex -> allows the search to contain string instead of === string
  // options i -> allows search to be case insensitive
  db.Recipe.find({name:{'$regex' : searchTerm, '$options' : 'i'}})
    .exec(function (err, recipe) {
      if (err) {
        return err;
      } else {
      	res.json(recipe);
      }
	});
};

// for Nav Component - from getUsername function
exports.getUsername = function(req, res) {
  if (req.user) {
    res.json(req.user.name);  
  } else {
    res.json(null);
  }
};

// for viewRecipes Component - get all recipes for user
exports.getUserRecipes = function(req, res) {
  if (req.user) {
    db.User.findById(req.user._id)
    .populate('recipes')
    .exec(function(err, user) {
      res.send(user.recipes);
    });
  } else {
    res.end();
  }
}

exports.addRecipe = function(req, res) {
  if (req.user) {
    console.log('user>>>>>\n',req.user);
    console.log('body>>>>>\n',req.body);
    req.body._creator = req.user._id;
    // create recipe in database
    let recipeId;
    db.Recipe.create(req.body)
      .then((recipe) => {
      console.log('err')
      // push recipe into user's recipes array
      console.log('recipe>>>>>\n',recipe);
      recipeId = recipe.id;
      db.User.findByIdAndUpdate(req.user._id, {$push: {recipes: recipe.id}})
      .then(() => {
        res.json(recipeId);
      })
      .catch((err)=>{
        console.log('error in adding to db', err)
      })
    })
    .catch((err)=>{
      console.log('error in adding to db', err)
      if(err.code === 11000) {
        res.json(err.code);
      }
    })
  } else {
    res.end();
  }
};

// for viewShoppingList Component - get all saved recipes for shopping
exports.getShoppingList = function(req, res) {
  if (req.user) {
    db.User.findById(req.user._id)
    .populate('shoppinglist')
    .exec(function(err, user) {
      res.send(user.shoppinglist);
    });
  } else {
    res.end();
  }
}

exports.addToShoppingList = function(req, res) {

  if (req.user) {
      db.User.findByIdAndUpdate(req.user._id, {$push: {shoppinglist: req.query.recipeId}})
      .then(() => {
        res.json(req.query.recipeId);
      })
  } else {
    res.end();
  }
};

exports.clearShoppingList = function(req, res) {

  if(req.user) {
    // db.User.findByIdAndUpdate(req.user._id, )
  }  
}

exports.getRecipeById = function(req, res) {
  console.log('ID>>>>>>>>>>>>\n',req.body.id)
  var retrievedRecipe; 
  db.Recipe.findById(req.body.id)
  .then((recipe) => {
    retrievedRecipe = recipe;
    console.log(retrievedRecipe._creator);
    return recipe._creator;
  })
  .then((userId) => {
    db.User.findById(userId)
    .then((results)=>{
      console.log(typeof retrievedRecipe);
      retrievedRecipe.originator = results.name;
      console.log(retrievedRecipe)
      res.json(retrievedRecipe);
    });
  })
  .catch((err) => {
    console.log('error in finding ID');
  })
};