var mongoose = require('mongoose');
var db = require("../db/index.js");
mongoose.Promise = require('bluebird');

var vagueWordRecipeSearch = function (searchWord) {

	return new Promise((resolve, reject) => {
    db.Recipe.find({'$and': [{'$or':[{name: {'$regex': searchWord, '$options': 'i'}}, {'ingredients.ingredient': {'$regex':searchWord, '$options': 'i'}}, {'tags': {'$regex': searchWord, $options: 'i'}}]}, {'isPrivate': false}]})
    // db.Recipe.find({'$or':[{name: {'$regex' : searchWord, '$options': 'i'}}, {'ingredients.ingredient': {'$regex':searchWord, '$options': 'i'}}, {'tags': {'$regex': searchWord, $options: 'i'}}]})
    // .where('isPrivate').equals(false)
    .exec(function (err, recipes) {
      if (err) {
        reject(err);
        // console.log('erred while vague word search in db');
        reject(recipes);
      } else {
        console.log('recipes from db word vague: ', recipes);
        resolve(recipes);
      }
	  });
  });

}

module.exports.vagueWordRecipeSearch = vagueWordRecipeSearch;

var vaguePhraseRecipeSearch = function (searchPhrase) {
	let words = searchPhrase.split(' ');
	let resultRecipes = [];
	console.log('searchPhrase: ', searchPhrase);
	console.log('words length: ', words.length);
  return new Promise(function (resolve, reject) {

    //getting exact search results now
    for (let i = 0; i < words.length; i++) {
	    exactWordRecipeSearch(words[i])
	    .then((recipesArr) => {
	    	console.log('exactWordRecipeSearch recipesArr: ', recipesArr);
	    	for (let j = 0; j < recipesArr.length; j++) {
	    	  if (!resultRecipes.includes(JSON.stringify(recipesArr[j])))  {
	    		  resultRecipes.push(JSON.stringify(recipesArr[j]));
	        }
	    	}
	    })
	    .then(() => {
	    	//getting the vague search results now:
    	  console.log('inside then - vague search starting now: - resultRecipes: ', resultRecipes);
		    for (let l = 0; l < words.length; l++) {
			    vagueWordRecipeSearch(words[l])
			    .then((recipesArr1) => {
			    	for (let m = 0; m < recipesArr1.length; m++) {
			    	  if (!resultRecipes.includes(JSON.stringify(recipesArr1[m]))) {
			    		  resultRecipes.push(JSON.stringify(recipesArr1[m]));
			        }
			    	}
			    })
			    .then(() => {
			      console.log('final resultRecipes: ', resultRecipes);
			    	resolve(resultRecipes);
			    })
			  }
	    })
	    .catch((err) => {
	    	reject(resultRecipes);
	    })
	  }
  });
}

module.exports.vaguePhraseRecipeSearch = vaguePhraseRecipeSearch;

var exactWordRecipeSearch = function (searchWord) {

	console.log('inside exactWordRecipeSearch, search word: ', searchWord);
  return new Promise((resolve, reject) => {
    // db.Recipe.find({'$and': [{'$or':[{name: {'$regex': searchWord, '$options': 'i'}}, {'ingredients.ingredient': {'$regex':searchWord, '$options': 'i'}}, {'tags': {'$regex': searchWord, $options: 'i'}}]}, {'isPrivate': false}]})
    db.Recipe.find({'$or':[{name: searchWord}, {'ingredients.ingredient': searchWord}, {'tags': searchWord}]})
    .exec(function (err, recipes) {
      if (err) {
        reject(err);
        console.log('erred while exact word search in db');
        reject(recipes);
      } else {
        // console.log('recipes from db word exact: ', recipes);
        resolve(recipes);
      }
	  });
  });
}

// module.exports.exactWordRecipeSearch = vagueWordRecipeSearch;
