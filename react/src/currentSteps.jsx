import React from 'react';

class CurrentSteps extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      directions: this.props.directions
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
    this.props.onClick(this.props.index);
  }

  render () {
    return(
      <tr>
        <td>Steps {this.props.index + 1}:<input type="text" name="directions" value={this.state.directions} onChange={this.handleChange} /></td>
        <td><input type="button" name="removeRecipe" value="Remove Step" onClick={this.remove} /></td>
      </tr>
    )
  }
};

export default CurrentSteps;