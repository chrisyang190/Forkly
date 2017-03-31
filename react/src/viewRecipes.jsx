import React from 'react';
import $ from 'jquery';
import RecipeSearch from './recipeSearch.jsx';

class ViewRecipes extends React.Component {
  constructor(props) {
    super(props);
    console.log('props in viewRecipes', props);
  }

  //before initial render, use ajax call to retrieve all recipes belonging to user
  componentDidMount() {
    var boundThis = this;
    $.ajax({
      url: '/getAllRecipes',
      type:'GET',
      success: function(data){
        console.log('data from in getAllRecipes', data);
        boundThis.setState({recipes: data});
      },
      error: function(err) {
        console.log('could not retrieve any recipes for user');
      }
    });
  }

  handleClick(recipeId) {
    //redirect to /recipes/recipeId
    // console.log('recipeID passed in', recipeId);
    const { router } = this.context
    router.history.push('/recipe/' + recipeId);
  }

  handleAdd(recipeId) {
    // console.log('recipeID passed in', recipeId);
    $.ajax({
      url: '/addToShoppingList',
      type: 'GET',
      data: {'recipeId': recipeId},
      success: function(data){
        console.log('successfully added to shopping list');
      },
      error: function(err) {
        console.log('did not successfully add to shopping list:', err);
      }
    })
  }

  render () {
    var recipesArray = [];
    var template = '';

    if (this.state) {
      // this.state.recipes.forEach((recipe, index) => {
      // recipesArray.push(
      // <li>
      //   <span className="recipeSingle" 
      //     key={index} 
      //     value={recipe} 
      //     onClick={() => this.handleClick(recipe._id)}>
      //     {recipe.name}
      //   </span>
      //   <button onClick= {() => this.handleAdd(recipe._id)}>Add to Shopping List</button>
      //   </li>
      //   )
      // });

      template = 
      <div className="myRecipes">
        <img className="myRecipeImage" src="assets/images/salmon.jpg"/>
        <h1 className="myRecipesTitle">My Recipes</h1>
        <ul className="recipesArray">
          {this.state.recipes.map((recipe, index) => <RecipeSearch recipe={recipe} key={index}/>)}
        </ul>
        <br />
        <br />
      </div>
    } else {
      template = 
      <div >
        <img className="myRecipeImage" src="assets/images/salmon.jpg"/>
        <h1 className="myRecipesTitle">My Recipes</h1>
        <div className="loadingText"> 
          <h3>Loading...</h3>
          <br/>
          <h3>Please login or create your first recipe!</h3>
          <br />
          <br />
        </div>
      </div>
    }
    return (
      template
    )
  }
}

ViewRecipes.contextTypes = {
  router: React.PropTypes.object
}

export default ViewRecipes;