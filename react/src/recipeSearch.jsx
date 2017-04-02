import React from 'react';
import RecipeIngredients from './recipeIngredients';
import $ from 'jquery';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';
import Button from 'react-bootstrap/lib/Button';
import Grid from 'react-bootstrap/lib/Grid.js';
import Col from 'react-bootstrap/lib/Col.js';

class RecipeSearch extends React.Component {
  constructor(props) {
  	super(props);
    this.state = {
      added: false
    }
  }

  setSearchTerm(searchTerm) {
    this.setState({searchTerm: searchTerm});
  }

  searchRecipes(searchTerm) {
    console.log(this.props)
    // send ajax request to server, which then searches db for searchTerm
    var searchTerm = {searchTerm: this.state.searchTerm};
    var context = this;

    $.ajax({
      url: '/searchRecipes',
      type:'POST',
      data: JSON.stringify(searchTerm),
      contentType: 'application/json',
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

   handleAdd(recipe) {
    // console.log('recipeID passed in', recipeId);
    this.setState({
      added: true
    })

    $.ajax({
      url: '/addToShoppingList',
      type: 'GET',
      data: {'recipe': recipe},
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
    let name = this.props.recipe._creator.name;
    let display = name === undefined ? 'My' : `${name}'s`
    if (isAdded) {
      message = <span className='info'> This recipe has been added to your shopping list </span>
    } else {
     
    }

  	return (
  	  <span className='results'>
        <Grid>
          <Col md={2}>
            <div className='searchName'>
              <h3 onClick={() => this.handleClick(this.props.recipe._id)}><em>{`${display} ${this.props.recipe.name}`}</em></h3>
            </div>
              {message}
            <div className='ingredients'>
              <h4 className='searchIngredients'>Ingredients</h4>
              <p>{this.props.recipe.ingredients.map((ingredient, index) => <RecipeIngredients ingredient={ingredient} key={index}/>)}</p>
            </div>
            <div>
              <h4 className='searchDirections'>Directions</h4>
              {this.props.recipe.directions.map((dir, idx)=> <p>Step {idx+1}:{dir}</p>) }
            </div>
          </Col>
          <Col md={2}>
              <Button bsSize="small" onClick= {() => this.handleAdd(this.props.recipe)}><Glyphicon glyph="shopping-cart" /> </Button>
          </Col>
        </Grid>
  	  </span>
  	)

    // return (
    //   <span className='results'>
    //     <Grid> 
          
    //       <Col xs={6} md={4}>
    //         <code>
    //           <div className='searchName'>
    //             <h3 onClick={() => this.handleClick(this.props.recipe._id)}><em>{this.props.recipe.name}</em></h3>
    //             <Button bsSize="small" onClick= {() => this.handleAdd(this.props.recipe)}><Glyphicon glyph="shopping-cart" /> </Button>
    //           </div>
    //             {message}
    //           <div className='ingredients'>
    //             <h4 className='searchIngredients'>Ingredients</h4>
    //             <p>{this.props.recipe.ingredients.map((ingredient, index)=> <RecipeIngredients ingredient={ingredient} key={index}/>)}</p>
    //           </div>
    //           <div>
    //             <h4 className='searchDirections'>Directions</h4>
    //             <p>{this.props.recipe.directions}</p>
    //           </div>
    //         </code>
    //       </Col>
    //       <Col xs={12} md={8}>
    //         <code>
    //           <img src="assets/images/roastedchicken.jpg" />
    //         </code>
    //       </Col>
    //     </Grid>
    //   </span>
    // )
  }

}

RecipeSearch.contextTypes = {
  router: React.PropTypes.object
}

export default RecipeSearch;