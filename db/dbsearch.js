var mongoose = require('mongoose');
var db = require("../db/index.js");
mongoose.Promise = require('bluebird');

var vagueWordRecipeSearch = function (searchWord) {

	return new Promise((resolve, reject) => {
    // db.Recipe.find({'$and': [{'$or':[{name: {'$regex': searchWord, '$options': 'i'}}, {'ingredients.ingredient': {'$regex':searchWord, '$options': 'i'}}, {'tags': {'$regex': searchWord, $options: 'i'}}]}, {'isPrivate': false}]})
    db.Recipe.find({'$or':[{name: {'$regex' : searchWord, '$options': 'i'}}, {'ingredients.ingredient': {'$regex':searchWord, '$options': 'i'}}, {'tags': {'$regex': searchWord, $options: 'i'}}]})
    // .where('isPrivate').equals(false)
    .exec(function (err, recipes) {
      if (err) {
        reject(err);
        // console.log('erred while vague word search in db');
        reject(recipes);
      } else {
        // console.log('recipes from db word vague: ', recipes);
        resolve(recipes);
      }
	  });
  });

}

module.exports.vagueWordRecipeSearch = vagueWordRecipeSearch;

var vaguePhraseRecipeSearch = function (searchPhrase, callBack) {
	let words = searchPhrase.split(' ');
	let resultRecipes = [];
	// console.log('words length: ', words.length);
  return new Promise(function (resolve, reject) {
    for (let i = 0; i < words.length; i++) {
	    vagueWordRecipeSearch(words[i])
	    .then((recipesArr) => {
	    	// console.log('phrase vague search, recipesArr:', recipesArr);
	    	for (let j = 0; j < recipesArr.length; j++) {
	    	// 	console.log('phrase vague search, in for loop- recipesArr:', recipesArr);
	    	// 	console.log('phrase vague search, in for loop- resultRecipes:', recipesArr);
	    	  if (!resultRecipes.includes(recipesArr[j])) {
	    		  // console.log('inside if of vague phrase saerch, recipesArr[i]: ', recipesArr[j]);
	    		  resultRecipes.push(recipesArr[j]);
	        }
	        if (j === recipesArr.length - 1 && i === words.length - 1) {
	        	resolve(resultRecipes);
	        }
	    	}
	    })
	    .catch((err) => {
	    	reject(resultRecipes);
	    })

	  }

  });
}

module.exports.vagueWordRecipeSearch = vagueWordRecipeSearch;

var exactWordRecipeSearch = function (searchWord) {
  
}

module.exports.exactWordRecipeSearch = vagueWordRecipeSearch;
