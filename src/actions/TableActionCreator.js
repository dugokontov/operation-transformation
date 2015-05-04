'use strict';
import GLU from 'glu.js';
import TableActions from './TableActions';

class TableActionCreator {
  static updateCell(payload) {
    GLU.bus.emitAction(TableActions.UPDATE_CELL, payload);
  }
  static addRow(payload) {
    GLU.bus.emitAction(TableActions.ADD_ROW, payload);
  }
  static deleteRow(payload) {
    GLU.bus.emitAction(TableActions.DELETE_ROW, payload);
  }
  static userChangePosition(payload) {
    GLU.bus.emitAction(TableActions.USER_CHANGE_POSITION, payload);
  }
}

export default TableActionCreator;
