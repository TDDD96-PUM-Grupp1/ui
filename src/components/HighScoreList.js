import React, { Component } from 'react';
import PropTypes from 'prop-types';

class HighScoreList extends Component {
  constructor(props) {
    console.log('saker');
    super(props);
    this.state = {
      scoreManager: this.props.scoreManager
    }
    this.props.scoreManager.addScoreListener(this);

    this.update = this.update.bind(this);
  }

  update(){
    this.render();
  }

  render() {
    console.log(this.state.scoreManager);
    return (<div>text</div>);
  }
}

HighScoreList.propTypes = {
  scoreManager: PropTypes.object.isRequired
};

export default HighScoreList;
