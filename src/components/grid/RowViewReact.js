'use strict';
import React from 'react';
import CellViewReact from './CellViewReact';

class RowViewReact extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let cells = this.props.row.slice(1).map((cell, index) => <CellViewReact
      key={this.props.columns[index].id}
      cell={cell}
      rowID={this.props.row[0]}
      columnID={this.props.columns[index].id}
      onValueChange={this.props.onValueChange}/>);
    cells.unshift(<td key='cellID'>{this.props.row[0]}</td>);
    return (<tr>{cells}</tr>);
  }
}

export default RowViewReact;
