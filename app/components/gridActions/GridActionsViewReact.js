'use strict';
var TableActions = require('../../actions/TableActions.js');

var GridViewReact = React.createClass({
  addRow(): any {
    this.props.view.emit(TableActions.ADD_ROW, {
      rowIndex: +React.findDOMNode(this.refs.rowPosition).value.trim()
    });
  },
  deleteRow(): any {
    this.props.view.emit(TableActions.DELETE_ROW, {
      rowIndex: +React.findDOMNode(this.refs.rowPosition).value.trim()
    });
  },
  render(): any {
    return <div>
      <button id="add-row" onClick={this.addRow}>Add new row</button>
      <button id="remove-row" onClick={this.deleteRow}>Remove row</button>
      <input id="rowPosition" type="text" defaultValue="1" ref="rowPosition" />
    </div>;
  }
});

module.exports = GridViewReact;