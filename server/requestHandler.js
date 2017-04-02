var express = require('express');
var request = require('request');
var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

var db = require("../db/index.js");
var dbSearch = require('../db/dbSearch.js');

// for Home Component - from searchRecipes function
exports.searchRecipes = function(req, res) {
  var searchTerm = req.body.searchTerm;
  // regex -> allows the search to contain string instead of === string
  // options i -> allows search to be case insensitive
  dbSearch.vaguePhraseRecipeSearch(searchTerm).then((recipes) => {
    console.log('this is callback in handler: recipes: ', recipes);
    res.json(recipes);
  })
  .catch((err) => {
    console.log('errored out in handler');
    res.status(500).send();
  })
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
    .populate('_creator')
    .exec(function(err, user) {
      console.log(user)
      res.send(user);
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
      res.send({shoppinglist: user.shoppinglist, shoppingingredients: user.shoppingingredients});
    });
  } else {
    res.end();
  }
}

exports.addToShoppingList = function(req, res) {

  if (req.user) {
    db.User.findById(req.user._id)
    .then((user) => {
    
    var ingredientsArray = req.query.recipe.ingredients;
    console.log('ingredientsArray:', ingredientsArray);
    var ingredientsObject = user['shoppingingredients'] || {};

    for (var i = 0; i < ingredientsArray.length; i++) {
      if (ingredientsObject[ingredientsArray[i].ingredient]) {
        ingredientsObject[ingredientsArray[i].ingredient]['quantity'] = ingredientsObject[ingredientsArray[i].ingredient]['quantity'] + parseInt(ingredientsArray[i]['quantity']);
      } else {
        console.log('ingredient:', ingredientsArray[i].ingredient);
        ingredientsObject[ingredientsArray[i].ingredient] = {'quantity': null, 'units': null, 'checked': null};
        ingredientsObject[ingredientsArray[i].ingredient]['quantity'] = parseInt(ingredientsArray[i]['quantity']);
        ingredientsObject[ingredientsArray[i].ingredient]['units'] = ingredientsArray[i]['units'];
        ingredientsObject[ingredientsArray[i].ingredient]['checked'] = false;
      } 
    }
      return ingredientsObject;
    }) //
    .then((ingredients) => {
      db.User.findByIdAndUpdate(req.user._id, {$push: {shoppinglist: req.query.recipe._id}, shoppingingredients: ingredients})
      .then(() => {
        res.status(200).json(req.query.recipeId);
      })
    })
    .catch((error) => {
      console.log('error:', error);
      res.status(500).send(error);
    })

  } else {
    res.end();
  }
};

exports.removeShoppingRecipe = function (req, res) {
  console.log('req.query in removeShopping Recipe', req.query)
  if(req.user) {

    db.User.findById(req.user._id)
    .then((user) => {
    
    var ingredientsArray = req.query.removed[0].ingredients;
    console.log('ingredientsArray:', ingredientsArray);
    var ingredientsObject = user['shoppingingredients'] || {};

    for (var i = 0; i < ingredientsArray.length; i++) {
      if (ingredientsObject[ingredientsArray[i].ingredient]) {
        ingredientsObject[ingredientsArray[i].ingredient]['quantity'] = ingredientsObject[ingredientsArray[i].ingredient]['quantity'] - parseInt(ingredientsArray[i]['quantity']);
        if (ingredientsObject[ingredientsArray[i].ingredient]['quantity'] === 0){
          delete ingredientsObject[ingredientsArray[i].ingredient];
        }
      } else {
        console.log('ingredient:', ingredientsArray[i].ingredient);
        ingredientsObject[ingredientsArray[i].ingredient] = {'quantity': null, 'units': null, 'checked': null};
        ingredientsObject[ingredientsArray[i].ingredient]['quantity'] = parseInt(ingredientsArray[i]['quantity']);
        ingredientsObject[ingredientsArray[i].ingredient]['units'] = ingredientsArray[i]['units'];
        ingredientsObject[ingredientsArray[i].ingredient]['checked'] = false;
      } 
    }
      return ingredientsObject;
    }) 

    .then((ingredients) => {
      var recipeIDs = [];
      if(req.query.recipes) {
        for (var i = 0; i <req.query.recipes.length; i++) {
          recipeIDs.push(req.query.recipes[i]._id);
        }
      }
      console.log('recipeIDs:', recipeIDs);
      db.User.findByIdAndUpdate(req.user._id, {shoppinglist: recipeIDs, shoppingingredients: ingredients})
      .then((user) => {
        res.status(200).json(user);
      })
    })
    // .then((user) => {
    //   res.status(200).json(user);
    // })
    .catch((error) => {
      console.log('error:', error);
      res.status(500).send(error);
    })

  } else {
    res.end();
  }
}

exports.clearShoppingList = function(req, res) {

  if(req.user) {
    db.User.findByIdAndUpdate(req.user._id, {shoppinglist: [], shoppingingredients: null})
    .exec((err, user) => {
      res.send(user.shoppinglist);
    })
  } else {
    res.end();
  }
}


exports.changeCheckbox = function(req, res) {
  console.log('req.user', req.user);

if(req.user){
  console.log('request.query.ingredient in changeCheckbox', req.query.ingredient);
  db.User.findById(req.user._id)
  .then((user) => {
    var temp = user.shoppingingredients;
    temp[req.query.ingredient.ingredient]['checked'] = req.query.ingredient.checked;

    console.log('temp:', temp);
    return temp
  })
  .then((temp) => {
    db.User.findByIdAndUpdate(req.user._id, {shoppingingredients: temp})
      .then(() => {
        res.status(200).send();
      })
  })
  .catch((error) => {
      console.log('error:', error);
      res.status(500).send(error);
    })


  // if(req.user) {
  //   db.User.findByIdAndUpdate(req.user._id, {shoppingingredients: null})
  //   .exec((err, user) => {
  //     res.send(user.shoppinglist);
  //   })
  } else {
    res.end();
  }
}

exports.getRecipeById = function(req, res) {
  console.log('ID>>>>>>>>>>>>\n',req.query)
  db.Recipe.findById(req.query.id)
  .populate({
    path: 'forked _creator',
    populate: {path: '_creator'}
  })
  .exec((err, results)=>{
    res.send(results);
  })
  .catch((err) => {
    console.log('error in finding ID');
  })
};