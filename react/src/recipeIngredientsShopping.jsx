import React from 'react';
import $ from 'jquery';

class ShoppingRecipeIngredient extends React.Component {
  constructor(props) {
    super(props);
    console.log('this.props.ingredient.checked', this.props.ingredient.checked);
    this.state = {
      ingredient: this.props.ingredient,
      checked: this.props.ingredient.checked
    }
  }

  changeCheckbox () {
    console.log('state before setState', this.state.checked);
    console.log('this.state.ingredient', this.state.ingredient);
    


    // this.setState({
    //   checked: !this.state.checked
    // });
    var temp = this.state.ingredient;
    temp.checked = !this.state.checked;

    this.setState({
      ingredient: temp
    })
    
    console.log(`state after setState: ${this.state.checked}`);

    var context = this
    $.ajax({
      url: '/changeCheckbox',
      method: 'GET',
      data: {
        ingredient: context.state.ingredient,
      },
      success: function(data){
        console.log('successfully changed checkbox');
        context.setState({
          checked: context.props.ingredient.checked
        })
      },
      error: function(err) {
        console.log('did not change checkbox:', err);
      }
    })
  }


  render() {
    return (
      <li className="searchIngredient">
      <input type="checkbox" checked = {this.state.checked} onChange ={() => {this.changeCheckbox()}}></input>
        {this.props.ingredient.quantity} {this.props.ingredient.units} {this.props.ingredient.ingredient}
      </li>
    )
  }
}

export default ShoppingRecipeIngredient;