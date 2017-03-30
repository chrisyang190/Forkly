import React from 'react';
import $ from 'jquery';

import RecipeSearch from './recipeSearch.jsx';

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
      success: function(data){
        console.log('ajax request to search recipes was successful!');
        console.log('response', data);
        context.setState({recipes: data});
        
      },
      error: function(err) {
        console.log('ajax request to search recipes failed');
      }
    });
  };

  render() {
  	return (
  	  <div>
        <div className="search">
          <img className="searchImage" src="assets/images/steak.jpg" alt="steak"/>
          <span className="searchText">  
            <h3>Yummly</h3>
            <input type="text" 
                   onKeyUp={ (event) => {
                              this.setSearchTerm(event.target.value)
                            }}
            />
            <button onClick={(event) => {
                              this.searchRecipes(this.state.searchTerm)
                            }}
            >Search Recipes</button>
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

