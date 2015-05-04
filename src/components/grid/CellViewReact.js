'use strict';
import React from 'react';

class CellViewReact extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: this.props.cell
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      value: nextProps.cell
    });
  }

  onChange(event) {
    this.setState({
      value: event.target.value
    });
  }

  onBlur(event) {
    if (event.target.value === this.props.cell) {
      return;
    }
    this.props.onValueChange({
      value: event.target.value,
      rowID: this.props.rowID,
      columnID: this.props.columnID
    });
  }

  render() {
    return (<td><input type="text"
      value={this.state.value}
      onChange={this.onChange.bind(this)}
      onBlur={this.onBlur.bind(this)} /></td>);
  }
}

export default CellViewReact;
