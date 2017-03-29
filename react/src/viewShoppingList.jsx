import React from 'react';
import $ from 'jquery';

class ViewShoppingList extends React.Component {
  constructor(props) {
    super(props);
  }

  //before initial render, use ajax call to retrieve all recipes belonging to user
  componentDidMount() {
    var boundThis = this;
    $.ajax({
      url: '/getAllRecipes',
      type:'GET',
      success: function(data){
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

  render () {
    var recipesArray = [];
    var template = '';

    if (this.state) {
      this.state.recipes.forEach((recipe, index) => {
      recipesArray.push(
        <li className="recipeSingle" 
          key={index} 
          value={recipe} 
          onClick={() => this.handleClick(recipe._id)}>
          {recipe.name}
        </li>)
      });

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

ViewShoppingList.contextTypes = {
  router: React.PropTypes.object
}

export default ViewShoppingList;