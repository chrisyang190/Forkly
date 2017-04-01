import React from 'react';
import $ from 'jquery';
import ShoppingRecipeIngredient from './recipeIngredientsShopping.jsx';
import RecipeList from './recipeList.jsx';
import Grid from 'react-bootstrap/lib/Grid.js'
import Col from 'react-bootstrap/lib/Col.js'

class ViewShoppingList extends React.Component {
  constructor(props) {
    super(props);
  }

  //before initial render, use ajax call to retrieve all recipes belonging to user
  componentDidMount() {
    console.log('component did mount');
    var boundThis = this;
    $.ajax({
      url: '/getShoppingList',
      type:'GET',
      success: function(data){
        console.log('data from viewShoppingList', data);

        var ingredientsArray = [];

        for (var key in data.shoppingingredients) {
          var object = {
            ingredient: null,
            quantity: null,
            units: null,
            checked: null
          }
          object['ingredient'] = key;
          object['quantity'] = data.shoppingingredients[key]['quantity'];
          object['units'] = data.shoppingingredients[key]['units'];
          object['checked'] = data.shoppingingredients[key]['checked'];

          ingredientsArray.push(object);
        }

        boundThis.setState({
          recipes: data.shoppinglist,
          ingredients: ingredientsArray
        });
        // console.log('this.state.recipes', this.state.recipes);
        // console.log('this.state.ingredients', this.state.ingredients);
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

  removeShoppingRecipe(index) {
    let currentRecipes = this.state.recipes;
    var removed = currentRecipes.splice(index,1);
    console.log('removed:', removed);
    console.log('currentRecipes', currentRecipes);
    this.setState({recipes: currentRecipes});

    var context = this;
    $.ajax({
      url:'/removeShoppingRecipe',
      type: 'GET',
      data: {
        'recipes': currentRecipes,
        'removed': removed
      },
      success: function(data) {
        // context.setState({
        // })
        console.log('data from removeShopping Recipe', data);
        context.componentDidMount();
      },
      error: function(err) {
        console.log('errored in removing Shopping Recipe:', err);
      }
    })



  }

  clearShoppingList() {
    var context = this;
    $.ajax({
      url: '/clearShoppingList',
      type:'GET',
      success: function(data){
        console.log('successfully cleared shopping list', data);
        context.setState({
            recipes: [],
            ingredients: []
        });
      },
      error: function(err) {
        console.log('errored in clearing the shopping list');
      }
    });

  }

  render () {
    var recipesArray = [];
    var template = '';
    var ingredientsArray = [];

    if (this.state) {

      template = 
      <div className="myRecipes">
        <img className="myRecipeImage" src="assets/images/veggies.jpg"/>
        <h1 className="myRecipesTitle">Shopping List</h1>
          <Grid>
            <Col md={6}>
              <code>
                <h4 className="listTitle"> Recipes </h4>
                  <ul className="recipesArray">
                    {this.state.recipes.map((recipe, index) => <RecipeList recipe={recipe} key={index+recipe} removeShoppingRecipe={this.removeShoppingRecipe.bind(this)}/>)}
                  </ul>
              </code>
            </Col>
            <Col md={6}>
              <code>
              <h4 className="listTitle"> Shopping List </h4>
                  <ul className="recipesArray">
                    {this.state.ingredients.map((ingredient, index) => (<ShoppingRecipeIngredient ingredient={ingredient} key={index}/>))}
                  </ul>
                <button onClick = {() => this.clearShoppingList()}> Clear List </button>
              </code>
            </Col>
          </Grid>

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