import React from 'react';

class Tags extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.remove = this.remove.bind(this);
  }
  remove(){
    this.props.onClick(this.props.index)
  }
  render () {
    return(
      <li onClick={this.remove}>{this.props.tag}</li>
    )
  };
};

export default Tags