import React from 'react';
import $ from 'jquery';

import RecipeIngredients from './recipeIngredients'

class ViewFork extends React.Component {

  constructor(props) {
    super(props);
    this.forkMe = this.forkMe.bind(this);
  }

  componentDidMount(){
    let pathname = this.context.router.route.location.pathname;
    let recipeId = pathname.slice(pathname.lastIndexOf('/') + 1);
    let boundThis = this;
     $.ajax({
      url: '/getRecipeById',
      type:'POST',
      data: JSON.stringify({id: recipeId}),
      contentType: 'application/json',
      success: function(data){
        console.log(data);
        boundThis.setState({recipe: data});
      },
      error: function(err) {
        console.error('could not retrieve any recipes for user');
      }
    });
  }

  forkMe() {
    const { router } = this.context;
    var forked = router.route.location.pathname;
    let forkedId = forked.slice(forked.lastIndexOf('/') + 1);
    router.history.push('/addrecipe/' + forkedId);
  }

  render () {
    let template = '';
    if (this.state) {
      let { recipe } = this.state;
      template = 
      <div className="viewFork">
        <header>
          <h1 className="recipeName">{recipe.name}</h1>
          <h1 className="recipeName">Tags:</h1>
        {recipe.tags.map(( tag => <p>{tag}</p>))}
          <br />
        </header>
        <h3 className="title">Ingredients: </h3>
        <p>{recipe.ingredients.map( (ingredient, index) => 
          <RecipeIngredients ingredient={ingredient} key={index}/>
          )}
        </p>
        <br/>
        <h3 className="title"> Directions: </h3>
        <p>{recipe.directions}</p>
        <br />
        <button onClick={this.forkMe}>Fork Me</button>

      </div>
    } else {
      template = 
      <div>
        <h3>Loading Your Recipes...</h3>
      </div>
    }
    return (
      template
    )
  }
}

ViewFork.contextTypes = {
  router: React.PropTypes.object
}

export default ViewFork;