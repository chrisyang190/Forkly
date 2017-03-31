import React from 'react';
import $ from 'jquery';

class ShoppingRecipeIngredient extends React.Component {
  constructor(props) {
    super(props);
    console.log('this.props.ingredient.checked', this.props.ingredient.checked);
    this.state = {
      ingredient: this.props.ingredient,
      checked: JSON.parse(this.props.ingredient.checked)
    }
    console.log('this.state.checked', this.state.checked);
  }

  changeCheckbox (event) {
    
    this.setState({
      checked: !this.state.checked
    });
    console.log('event target checked', event.target.checked);

    var temp = this.state.ingredient;
    temp.checked = !this.state.checked;
    

    var context = this
    $.ajax({
      url: '/changeCheckbox',
      method: 'GET',
      data: {
        ingredient: temp
      },
      success: function(data){
        console.log('successfully changed checkbox');
      },
      error: function(err) {
        console.log('did not change checkbox:', err);
      }
    })
  }

  render() {
    return (
      <li className="searchIngredient">
      <input type="checkbox"  checked={this.state.checked} onChange ={this.changeCheckbox.bind(this)}></input>
        {this.props.ingredient.quantity} {this.props.ingredient.units} {this.props.ingredient.ingredient}
      </li>
    )
  }

}

export default ShoppingRecipeIngredient;