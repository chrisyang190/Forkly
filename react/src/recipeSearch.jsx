import React from 'react';
import RecipeIngredients from './recipeIngredients';
import $ from 'jquery';

class RecipeSearch extends React.Component {
  constructor(props) {
  	super(props);
    console.log('props in Recipe search', props);
    this.state = {
      added: false
    }
  }

  setSearchTerm(searchTerm) {
    this.setState({searchTerm: searchTerm});
  }

  searchRecipes(searchTerm) {
    // send ajax request to server, which then searches db for searchTerm
    var searchTerm = {searchTerm: this.state.searchTerm};
    var context = this;

    $.ajax({
      url: '/searchRecipes',
      type:'POST',
      data: JSON.stringify(searchTerm),
      contentType: 'application/json',
      success: function(data){
        console.log('ajax request was SUCCESSFUL!');
        // console.log('response', data);
        context.setState({recipes: data});
        
      },
      error: function(err) {
        console.log('ajax request failed');
      }

    });
  };

  handleClick(recipeId) {
    const { router } = this.context
    router.history.push('/recipe/' + recipeId);
  }

   handleAdd(recipeId) {
    // console.log('recipeID passed in', recipeId);
    this.setState({
      added: true
    })

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

  render() {
    const isAdded = this.state.added;
    let message = null;
    if (isAdded) {
      message = <span> This recipe has been added to your shopping list </span>
    } else {
     
    }

  	return (
  	  <span className='results'>
        <div className='searchName'>
          <h3 onClick={() => this.handleClick(this.props.recipe._id)}><em>{this.props.recipe.name}</em></h3>
          <button onClick= {() => this.handleAdd(this.props.recipe._id)}>Add to Shopping List</button>
        </div>
          {message}
        <div className='ingredients'>
          <h4 className='searchIngredients'>Ingredients</h4>
          <p>{this.props.recipe.ingredients.map((ingredient, index)=> <RecipeIngredients ingredient={ingredient} key={index}/>)}</p>
        </div>
        <div>
          <h4 className='searchDirections'>Directions</h4>
          <p>{this.props.recipe.directions}</p>
        </div>
  	  </span>
  	)
  }

}

RecipeSearch.contextTypes = {
  router: React.PropTypes.object
}

export default RecipeSearch;