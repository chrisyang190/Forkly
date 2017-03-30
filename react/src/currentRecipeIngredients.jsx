import React from 'react';

class CurrentIngredients extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      quantity: this.props.quantity,
      units: this.props.units, 
      ingredient: this.props.ingredient,
      showButton: true
    };
    this.handleChange = this.handleChange.bind(this);
    this.remove = this.remove.bind(this);
  }

  handleChange(event) {
    const target = event.target;
    const name = target.name;
    const value = target.value;
    this.setState({
      [name]: value
    });
  }

  remove() {
    console.log(this.state);
    this.props.onClick(this.props.index);
  }

  render () {
    return(
      <tr>
        <td><input type="number" name="quantity" value={this.state.quantity} onChange={this.handleChange} /></td>
        <td><input type="text" name="units" value={this.state.units} onChange={this.handleChange} /></td>
        <td>{this.state.ingredient}</td>
        <td><input type="button" name="addRecipeNewRow" value="Remove Row" onClick={this.remove} /></td>
      </tr>
    )
  }
};

export default CurrentIngredients;