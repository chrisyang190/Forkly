var mongoose = require('mongoose');
var db = require("../db/index.js");
const datamuse = require('datamuse');
mongoose.Promise = require('bluebird');

var vagueWordRecipeSearch = function (searchWord) {

	return new Promise((resolve, reject) => {
    // db.Recipe.find({'$and': [{'$or':[{name: {'$regex': searchWord, '$options': 'i'}}, {'ingredients.ingredient': {'$regex':searchWord, '$options': 'i'}}, {'tags': {'$regex': searchWord, $options: 'i'}}]}, {'isPrivate': false}]})
    db.Recipe.find({'$or':[{name: {'$regex' : searchWord, '$options': 'i'}}, {'ingredients.ingredient': {'$regex':searchWord, '$options': 'i'}}, {'tags': {'$regex': searchWord, $options: 'i'}}]})
    .where('isPrivate').equals(false)
    .populate('_creator')
    .exec(function (err, recipes) {
      if (err) {
        reject(err);
        console.log('erred while vague word search in db');
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
	// console.log('words length: ', words.length);
  return new Promise(function (resolve, reject) {

    //getting exact search results now
    // for (let i = 0; i < words.length; i++) {
	    fullTextSearch(searchPhrase)
	    .then((recipesArr) => {
	    	// console.log('fullTextSearch recipesArr: ', recipesArr);
	    	for (let j = 0; j < recipesArr.length; j++) {
	    	  if (!resultRecipes.includes(JSON.stringify(recipesArr[j])))  {
	    		  resultRecipes.push(recipesArr[j]);
	        }
	    	}
	    })
	    .then(() => {
	    	//getting the vague search results now:
    	  // console.log('inside then - vague search starting now: - resultRecipes: ', resultRecipes);
		    for (let l = 0; l < words.length; l++) {
			    vagueWordRecipeSearch(words[l])
			    .then((recipesArr1) => {
			    	// console.log('recipesArr1: ', recipesArr1);
			    	for (let m = 0; m < recipesArr1.length; m++) {
			    		// console.log('resultRecipes: ', resultRecipes);
			    		// console.log('recipesArr1[m]: ', recipesArr1[m]);

			    		console.log('resultRecipes.some((ele) => (ele._id === recipesArr1[m].id)) : ', resultRecipes.some((ele) => {return (ele._id === recipesArr1[m]._id)}));
			    	  if (!resultRecipes.some((ele) => ((JSON.stringify(ele._id) === JSON.stringify(recipesArr1[m]._id))))) {
			    		  resultRecipes.push(recipesArr1[m]);
			        }
			    	}
			    })
			    .then(() => {
			      console.log('final resultRecipes: ', resultRecipes);
			    	resolve(resultRecipes);
			    })
			  }
	    })
	    .then((recipes) => {
        datamuse.words({
        	ml: searchPhrase
        })
        /*.then((similarjson) => {
        	
          let similars = similarjson.map((ele) => {return ele.word});
          console.log('similar: ', similars);
          // search vague similar words
          let len = (similars.length > 10) ? 10 : similars.length;
          for (let p = 0; i < len; i++) {
          	console.log('looking for: ', similars[p]);
          	vagueWordRecipeSearch(similars[p])
				    .then((similarRecipes) => {
				    	console.log('similarRecipes: ', similarRecipes);
				    	for (let m = 0; m < similarRecipes.length; m++) {
				    	  if (!resultRecipes.some((ele) => ((JSON.stringify(ele._id) === JSON.stringify(similarRecipes[m]._id))))) {
				    		  resultRecipes.push(similarRecipes[m]);
				    		  console.log('similar recipe: ', similarRecipes[m]);
				        }
				    	}
				    })
				    .then(() => {
				      console.log('final resultRecipes: ', resultRecipes);
				    	resolve(resultRecipes);
				    })
          }
        	resolve(recipes);
        })*/
	    })
	    .catch((err) => {
	    	reject(resultRecipes);
	    })
	  // }
  });
}

module.exports.vaguePhraseRecipeSearch = vaguePhraseRecipeSearch;

/*var exactWordRecipeSearch = function (searchWord) {

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
*/

var fullTextSearch = function (searchPhrase) {
	return new Promise((resolve, reject) => {
		db.Recipe
		.find(
    	{ $text: { $search : searchPhrase } }, 
    	{ score : { $meta: "textScore" } }
		)
		.sort(
	    { 
	    	score: { $meta : 'textScore' } 
	    }
		)
		.exec(function (err, recipes) {
      if (err) {
      	console.log('err in search: ', err);
      	reject(recipes);
      } else {
      	// console.log('recipes in FTsearch: ', recipes);
      	resolve(recipes);
      }
		});
	});
	
}

