import React from 'react';
import $ from 'jquery';
import RecipeIngredients from './recipeIngredients'

class ViewShoppingList extends React.Component {
  constructor(props) {
    super(props);
    console.log('props in viewShoppingList', props);
    // this.state = {
    //   recipes: []
    // };
  }

  //before initial render, use ajax call to retrieve all recipes belonging to user
  componentDidMount() {
    var boundThis = this;
    $.ajax({
      url: '/getShoppingList',
      type:'GET',
      success: function(data){
        console.log('data from viewShoppingList', data);
        boundThis.setState({recipes: data});
      },
      error: function(err) {
        console.log('could not retrieve any recipes for user');
      }
    });
  }

  handleClick(recipeId) {
    //redirect to /recipes/recipeId
    const { router } = this.context
    router.history.push('/recipe/' + recipeId);
  }

  clearShoppingList() {

    $.ajax({
      url: '/clearShoppingList',
      type:'GET',
      success: function(data){
        console.log('successfully cleared shopping list', data);
      },
      error: function(err) {
        console.log('errored in clearing the shopping list');
      }
    });

  }

  render () {
    var recipesArray = [];
    var template = '';

    if (this.state) {
      console.log('this.state.recipes:', this.state.recipes);
      this.state.recipes.forEach((recipe, index) => {
      recipesArray.push(
        <div>
          <div className="recipeSingle" 
            key={index} 
            value={recipe} 
            onClick={() => this.handleClick(recipe._id)}>
            {recipe.name}
          </div>
          <p>{recipe.ingredients.map((ingredient, index)=> <RecipeIngredients ingredient={ingredient} key={index}/>)}</p>
        </div>
        )
      });

      console.log('recipesArray in ShoppingList:', recipesArray);

      template = 
      <div className="myRecipes">
        <img className="myRecipeImage" src="assets/images/salmon.jpg"/>
        <h1 className="myRecipesTitle">My Shopping List</h1>
        <ul className="recipesArray">
          {recipesArray}

        </ul>
        <br />
        <br />
      </div>
    } else {
      template = 
      <div >
        <img className="myRecipeImage" src="assets/images/salmon.jpg"/>
        <h1 className="myRecipesTitle">My Shopping List</h1>
        <div className="loadingText"> 
          <h3>Loading...</h3>
          <br/>
          <h3>You currently do not have anything in your shopping list!</h3>
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

ViewShoppingList.contextTypes = {
  router: React.PropTypes.object
}

export default ViewShoppingList;