import React from 'react';
import AddRecipeIngredients from './addRecipeIngredients.jsx';
import AddTag from './addTag.jsx';
import AddStep from './addStep.jsx';
import CurrentStep from './currentSteps.jsx';
import $ from 'jquery';


class AddRecipe extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      directions: [],
      tags: [],
      isPrivate: false, 
      ingredients: []
    }
    this.tagCreate = '';
    this.addRow = this.addRow.bind(this);
    this.handleIngredientsChange = this.handleIngredientsChange.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handlePrivateChange = this.handlePrivateChange.bind(this);
    this.tagClick = this.tagClick.bind(this);
    this.removeTag = this.removeTag.bind(this);
    this.removeIngredients = this.removeIngredients.bind(this);
    this.removeStep = this.removeStep.bind(this);
    this.addDirections = this.addDirections.bind(this);
  }

  componentDidMount () {

    var forked = this.context.router.history.location.pathname;
    let forkedId = forked.slice(forked.lastIndexOf('/') + 1);
    let boundThis = this;
    // if history has url at end
    if (forkedId !== 'addrecipe') {
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
        if(recipeId === 11000){
          console.log("recipe already exists");
        } else {
          router.history.push('/recipe/' + recipeId);
        }
      }
    });
    event.preventDefault();
  }

  addRow(ingObj){
    let myIngredients = ingObj;
    let myIngArr = this.state.ingredients

    myIngredients.showButton = false;
    myIngArr.push(ingObj);

    this.setState({ingredients: myIngArr});
    console.log(this.state.ingredients)
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

  handlePrivateChange () {
        console.log(this.state.isPrivate);
    this.setState({isPrivate: !this.state.isPrivate});
    console.log(this.state.isPrivate);
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

  removeTag(index){
    let tagArr = this.state.tags;
    tagArr.splice(index, 1);
    this.setState({tags: tagArr});
  }

  removeIngredients(index){
    console.log(index)
    let curIng = this.state.ingredients;
    curIng.splice(index,1);
    this.setState({ingredients: curIng});
    console.log(this.state.ingredients)
  }

  removeStep(index) {
    console.log(index);
    let curDir = this.state.directions;
    curDir.splice(index,1);
    this.setState({directions: curDir});
  }

  addDirections(dir) {
    let dirArr = this.state.directions;

    dirArr.push(dir);
    this.setState({directions:dirArr});
    console.log(this.state.directions);
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

          <AddTag onClick={this.tagClick} tagArr={this.state.tags} removeTag={this.removeTag}/>
       
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
            <AddRecipeIngredients addRow={this.addRow} ingArr={this.state.ingredients} removeIng={this.removeIngredients} />
          </table>
          <br />
        
          <h3 className="title"> Directions: </h3>
          <table className="directions">
            <thead>
              <tr>
                <td>Steps:</td>
              </tr>
            </thead>
            <tbody>
              {this.state.directions.map((dir, idx)=>(
                <CurrentStep key={idx+dir} index={idx} directions={dir} onClick={this.removeStep} />))} 
              <AddStep index={this.state.directions.length+1} addDirections={this.addDirections}/>
            </tbody>
          </table>

          <br/>
          <label for="makePrivate">Make Private?</label>
          <input type="checkbox" name="makePrivate" onChange={this.handlePrivateChange}/>

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