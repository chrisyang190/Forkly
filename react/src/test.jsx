import React from 'react';
import ViewFork from './viewFork.js';
import AddRecipe from './addRecipe.jsx';

class Test extends React.Component {
  constructor(props) {
    super(props);
    console.log(this. props);
    this.state = {};
    this.remove = this.remove.bind(this);
  }
  remove(){
    this.props.onClick(this.props.index)
  }
  render () {
    return(
      <div>
        <ViewFork wasForked={true}/>
        <AddRecipe wasForked={true}/>
      </div>
    )
  };
};

Test.contextTypes = {
  router: React.PropTypes.object
}

export default Test