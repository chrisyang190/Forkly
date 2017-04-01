import React from 'react';
import ViewFork from './viewFork.js';
import AddRecipe from './addRecipe.jsx';
import Grid from 'react-bootstrap/lib/Grid.js';
import Col from 'react-bootstrap/lib/Col.js';
import Row from 'react-bootstrap/lib/Row.js';

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
        <Grid>
          <Col md={6} mdPush={6}>
            <code>
              <ViewFork wasForked={true}/>
            </code>
          </Col>
          <Col md={6} mdPull={6}>
            <code>
              <AddRecipe wasForked={true}/>
            </code>
          </Col>
        </Grid>
      </div>
    )
  };
};

Test.contextTypes = {
  router: React.PropTypes.object
}

export default Test