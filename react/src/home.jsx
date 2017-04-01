import React from 'react';
import $ from 'jquery';
import RecipeSearch from './recipeSearch.jsx';
import Button from 'react-bootstrap/lib/Button';
import FormGroup from 'react-bootstrap/lib/FormGroup';
import FormControl from 'react-bootstrap/lib/FormControl';

class Home extends React.Component {
  constructor(props) {
  	super(props);
    this.state = {
      searchTerm: null,
      recipes: []
    };
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
      success: (data)=>{
        console.log('ajax request to search recipes was successful!');
        console.log('response', data);
        context.setState({recipes: data});
        
      },
      error: function(err) {
        console.log('ajax request to search recipes failed');
      }
    });
  };
 // <h3>Yummly</h3>
  render() {
  	return (
  	  <div>
        <div className="search">
          <img className="searchImage" src="assets/images/steak.jpg" alt="steak"/>
          <span className="searchText">  
           
            <FormGroup controlId="formBasicText">
            <FormControl type="text" 
                   onKeyUp={ (event) => {
                              this.setSearchTerm(event.target.value)
                            }}
            />
            <Button onClick={(event) => {
                              this.searchRecipes(this.state.searchTerm)
                            }}
            >Search Recipes</Button>
            </FormGroup>
          </span>
        </div>
        
        <div className="results">
          <ul>
            {this.state.recipes.map((recipe, index) => <RecipeSearch recipe={recipe} key={index}/>)}
          </ul>
        </div>
  	  </div>
  	)
  }
}

export default Home; 

