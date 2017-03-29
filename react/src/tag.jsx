import React from 'react';

class Tags extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render () {
    return(
      <li>{this.props.tag}</li>
    )
  };
};

export default Tags