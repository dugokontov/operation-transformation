'use strict';
import React from 'react';
import RowViewReact from './RowViewReact';

class GridViewReact extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let headers = this.props.columns.map(column => <th key={column.id}>{column.label}</th>);
    headers.unshift(<th key="id">#</th>);

    let rows = this.props.data.map(row => <RowViewReact
      key={row[0]}
      row={row}
      columns={this.props.columns}
      onValueChange={this.props.onValueChange}/>);
    return (
      <table>
        <thead>
          <tr>{headers}</tr>
        </thead>
        <tbody>
          {rows}
        </tbody>
      </table>
      );
  }
}

export default GridViewReact;
