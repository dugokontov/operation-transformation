'use strict';
import React from 'react';
import RowViewReact from './RowViewReact';

class GridViewReact extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let headers = this.props.columns.map(column => <th>{column.label}</th>);
    headers.unshift(<th>#</th>);

    let rows = this.props.data.map(row => <RowViewReact
      row={row}
      columns={this.props.columns}/>);
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
