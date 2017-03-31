import React from 'react';
import CurrentRecipeIngredients from './currentRecipeIngredients.jsx';


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
    this.onClick = this.onClick.bind(this);
  }

  handleChange(event) {
    const target = event.target;
    const name = target.name;
    const value = target.value;
    this.setState({
      [name]: value
    });
  }

  onClick() {
    this.props.addRow(this.state);
    this.setState({
      quantity: 0,
      units: '', 
      ingredient: '',
      showButton: true
    });
  }

  render() {
    return (
      <tbody>
        <tr>
          <td><input type="number" name="quantity" value={this.state.quantity} onChange={this.handleChange} /></td>
          <td><input type="text" name="units" value={this.state.units} onChange={this.handleChange} /></td>
          <td><input type="text" name="ingredient" value={this.state.ingredient} onChange={this.handleChange}/></td>
          <td><input type="button" name="addRecipeNewRow" value="Add Row" onClick={this.onClick} /></td>
        </tr>
        <tr>
          <td>ADD INGREDIENT</td>
        </tr>
        {this.props.ingArr.map((obj, idx) => 
          <CurrentRecipeIngredients 
            key={obj.units+obj.ingredient}
            index={idx}
            quantity={obj.quantity}
            units={obj.units}
            ingredient={obj.ingredient}
            onClick={this.props.removeIng}
            showButton={obj.showButton}
          />
        )}
      </tbody>
    )
  }
};

export default AddRecipeIngredients;