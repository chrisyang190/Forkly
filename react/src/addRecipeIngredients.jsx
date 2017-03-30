import React from 'react';

class AddRecipeIngredients extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      quantity: 0,
      units: '', 
      ingredient: '',
      showButton: true
    };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    const target = event.target;
    const name = target.name;
    const value = target.value;
    this.setState({
      [name]: value
    });
  }

  render() {
    return (
      <tr>
        <td><input type="number" name="quantity" value={this.state.quantity} onChange={this.handleChange} /></td>
        <td><input type="text" name="units" value={this.state.units} onChange={this.handleChange} /></td>
        <td><input type="text" name="ingredient" value={this.state.ingredient} onChange={this.handleChange}/></td>
        <td><input type="button" name="addRecipeNewRow" value="Add Row" onClick={()=>{this.props.addRow(this.state)}} /></td>
      </tr>
    )
  }
};

export default AddRecipeIngredients;