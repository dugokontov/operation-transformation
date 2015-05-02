'use strict';
import React from 'react';
import CellViewReact from './CellViewReact';

class RowViewReact extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let cells = this.props.row.map(cell => <CellViewReact cell={cell} />);
    return (<tr>{cells}</tr>);
  }
}

export default RowViewReact;