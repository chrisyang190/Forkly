import React from 'react';

class ShoppingRecipeIngredient extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      checked: false
    }
  }

  changeCheckbox () {
    this.setState({
      checked: !this.state.checked
    })
    console.log(`state: ${this.state.checked}`);
  }
  render() {
    return (
      <li className="searchIngredient">
      <input type="checkbox" onChange ={() => this.changeCheckbox()}></input>
        {this.props.ingredient.quantity} {this.props.ingredient.units} {this.props.ingredient.ingredient}
      </li>
    )
  }
}

export default ShoppingRecipeIngredient;