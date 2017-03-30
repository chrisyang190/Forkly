import React from 'react';

class AddStep extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      directions: ''
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
    this.props.addDirections(this.state.directions);
    this.setState({
      directions:''
    });
  }

  render() {
    return (
      <tr>
        <td>Step {this.props.index}: <input type="text" name="directions" value={this.state.directions} onChange={this.handleChange} /></td>
        <td><input type="button" name="addStep" value="Add Step" onClick={this.onClick} /></td>
      </tr>
    )
  }
};

export default AddStep;