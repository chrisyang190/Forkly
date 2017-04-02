import React from 'react';
import RecipeIngredients from './recipeIngredients';
import $ from 'jquery';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';
import Button from 'react-bootstrap/lib/Button';
import Grid from 'react-bootstrap/lib/Grid.js'
import Col from 'react-bootstrap/lib/Col.js'

class RecipeList extends React.Component {
  constructor(props) {
  	super(props);
    this.state = {
      added: false
    }
  }


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



  // render() {
  //   const isAdded = this.state.added;
  //   let message = null;

  // 	return (
  // 	  <span className='results'>
  //       <div className='searchName'>
  //         <h3 onClick={() => this.handleClick(this.props.recipe._id)}><em>{this.props.recipe.name}</em></h3>
  //         <Button bsSize="small" onClick= {() => this.props.removeShoppingRecipe(this.props.key)}><Glyphicon glyph="minus" /> </Button>
  //       </div>
  //         {message}
  //       <div className='ingredients'>
  //         <p>{this.props.recipe.ingredients.map((ingredient, index)=> <RecipeIngredients ingredient={ingredient} key={index}/>)}</p>
  //       </div>
  // 	  </span>
  // 	)
  // }

  render() {
    const isAdded = this.state.added;
    let message = null;

    return (
      <span className='results'>
        <Grid>
          <Col md={2}>
            <div className='searchName'>
              <h3 onClick={() => this.handleClick(this.props.recipe._id)}><em>{this.props.recipe.name}</em></h3>
            </div>
              {message}
            <div className='ingredients'>
              <p>{this.props.recipe.ingredients.map((ingredient, index)=> <RecipeIngredients ingredient={ingredient} key={index}/>)}</p>
            </div>
          </Col>
          <Col md={2}>
              <Button bsSize="small" onClick= {() => this.props.removeShoppingRecipe(this.props.index)}><Glyphicon glyph="minus" /> </Button>
          </Col>
        </Grid>
      </span>
    )
  }
}

RecipeList.contextTypes = {
  router: React.PropTypes.object
}

export default RecipeList;