import React from 'react';
import RecipeIngredients from './recipeIngredients'

class RecipeSearch extends React.Component {
  constructor(props) {
  	super(props);
    console.log('props in Recipe search', props);
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
      // type: 'GET',
      // data: searchTerm,
      contentType: 'application/json',
      // upon success, adds results to this.state.recipes
      success: function(data){
        console.log('ajax request was successful!');
        console.log('response', data);
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

  render() {
  	return (
  	  <span className='results'>
        <div className='searchName'>
          <h3 onClick={() => this.handleClick(this.props.recipe._id)}><em>{this.props.recipe.name}</em></h3>
        </div>
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