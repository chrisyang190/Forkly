import React from 'react';
import Tag from './tag.jsx';

class AddTags extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tag:''
    };
    this.handleTagChange = this.handleTagChange.bind(this);
    this.tagClick = this.tagClick.bind(this);
  }

  handleTagChange(event) {
    const target = event.target;
    const name = target.name;
    const value = target.value;

    this.setState({tag: value});
  }

  tagClick() {
    this.props.onClick(this.state.tag)
    this.setState({tag:''});
  }

  render () {
    return(
      <div>
        <h3 className="addTag">Tags:</h3>
          <input type="text" name="tags" value={this.state.tag} onChange={this.handleTagChange}/>
          <input type="button" name="addTag" value="Add Tag" onClick={this.tagClick}/>
        <br/>
        <ul>
          {this.props.tagArr.map((tag, idx) => <Tag key={idx} index={idx} tag={tag} onClick={this.props.removeTag}/>)}
        </ul>
      </div>
    )
  };
};

export default AddTags