'use strict';
import React from 'react';

class CellViewReact extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (<td><input type="text" defaultValue={this.props.cell} /></td>);
  }
}

export default CellViewReact;