import React from 'react';

class ShoppingRecipeIngredient extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <li className="searchIngredient">
      <input type="checkbox"></input>
        {this.props.ingredient.quantity} {this.props.ingredient.units} {this.props.ingredient.ingredient}
      </li>
    )
  }
}

export default ShoppingRecipeIngredient;