'use strict';

var ot;

var executeActions = {
  updateCell: function (request) {
    var actionData = request.value;
    var data = ot.getData();
    var columnIndex;
    for (var i = data.columns.length - 1; i >= 0; i -= 1) {
      if (data.columns[i].id === +actionData.columnID) {
        columnIndex = i;
        break;
      }
    }

    var row = data.data.filter(function (row) {
      return +row[0] === +actionData.rowID;
    })[0];

    row[columnIndex + 1] = actionData.value;
  }
};

var transformationMatrix = {
  updateCell: {
    updateCell: function (newRequest, oldRequest) {
      if (newRequest.value.rowID !== oldRequest.value.rowID || newRequest.value.columnID !== oldRequest.value.columnID) {
        return newRequest;
      }

      if (newRequest.priority < oldRequest.priority) {
        return newRequest;
      }
      // overwrite value with old request, or transform to no-op
      newRequest.value.value = oldRequest.value.value;
      return newRequest;
    }
  }
};

module.exports = function (operationTransformation) {
  ot = operationTransformation;
  ot.setExecuteActions(executeActions);
  ot.setTransformationMatrix(transformationMatrix);
};
