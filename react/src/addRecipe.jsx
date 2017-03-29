import React from 'react';
import AddRecipeIngredients from './addRecipeIngredients.jsx';
import AddTag from './addTag.jsx';
import $ from 'jquery';


class AddRecipe extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      directions: '',
      tags: [],
      ingredients: [{quantity: 1, units: 'spoonful', ingredient: 'sugar', showButton: true}]
    }
    this.tagCreate = '';
    this.addRow = this.addRow.bind(this);
    this.handleIngredientsChange = this.handleIngredientsChange.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.tagClick = this.tagClick.bind(this);
  }

  componentDidMount () {

    var forked = this.context.router.history.location.pathname;
    let forkedId = forked.slice(forked.lastIndexOf('/') + 1);
    let boundThis = this;
    // if history has url at end
    if (forkedId.length > 0) {
      console.log('hi');
      $.ajax({
        url: '/getRecipeById',
        type:'POST',
        data: JSON.stringify({id: forkedId}),
        contentType: 'application/json',
        success: function(data){
          boundThis.setState({
            name: data.name,
            directions: data.directions,
            ingredients: data.ingredients 
          });
        },
        error: function(err) {
          console.error('could not retrieve any recipes for user');
        }
      });
    } 
  }

  handleSubmit (event) {
    const { router } = this.context
    $.ajax({
      url: "/api/addRecipe",
      data: JSON.stringify(this.state),
      method: 'POST',
      contentType: 'application/JSON',
      success: (recipeId) => {
        router.history.push('/recipe/' + recipeId);
      }
    });
    event.preventDefault();
  }

  addRow() {
    let myIngredients = this.state.ingredients;
    myIngredients[myIngredients.length - 1].showButton = false;
    myIngredients.push({quantity: 0, units: '', ingredient: '', showButton: true});
    this.setState({ingredients: myIngredients});
  }

  handleIngredientsChange (event, index) {
    const target = event.target;
    const name = target.name;
    const value = target.value;
    console.log(`target:${target} name:${name} value:${value}`)

    let ing = this.state.ingredients;
    ing[index][name] = value;

    this.setState({
      ingredients: ing
    });
  }

  handleInputChange (event) {
    const target = event.target;
    const name = target.name;
    const value = target.value;

    this.setState({
      [name]: value
    });
  }

  tagClick(value) {
    let tagArr = this.state.tags;

    tagArr.push(value);
    this.setState({tags:tagArr});
  }

  

  render () {
    return (
      <div className="createRecipe">
        <header>
          <h1 className="recipeHeader">Create a Recipe</h1>
        </header>
        <br />
        <img className="recipeImage" src="assets/images/sushi.jpg" alt="sushi"/>
        <br />
        <form onSubmit={this.handleSubmit}>

          <h3 className="recipeName">Recipe Name:</h3> 
          <input type="text" value={this.state.name} name="name" onChange={this.handleInputChange}/>
      
          <br />

          <AddTag onClick={this.tagClick} tagArr={this.state.tags} />
       
          <br />
        
          <h3 className="title">Ingredients:</h3>
          <table className="ingredients">
            <thead>
              <tr>
                <td>Quantity</td>
                <td>Units</td>
                <td>Ingredient</td>
              </tr>
            </thead>
            {this.state.ingredients.map(function(val, index) {
               return <AddRecipeIngredients 
                        key={index} 
                        index={index} 
                        quantity={val.quantity} 
                        units={val.units} 
                        ingredient={val.ingredient} 
                        showButton={val.showButton} 
                        addRow={this.addRow} 
                        handleIngredientsChange={this.handleIngredientsChange}
                      />;
             }, this)}
          </table>
          <br />
        
          <h3 className="title"> Directions: </h3>
          <textarea name="directions" value={this.state.directions} onChange={this.handleInputChange}></textarea>

          <br />

          <div>
            <input type="submit" name="addRecipeSave" value="Save" />
            <input type="button" name="addRecipeCancel" value="Cancel" />
          </div>
        </form>
        <br/>
        <br/>
        <br/>
        <br/>
      </div>
    )
  }
}

AddRecipe.contextTypes = {
  router: React.PropTypes.object
}

export default AddRecipe;