'use strict';
import GLU from 'glu.js';
import TableActions from '/actions/TableActions';

const getInputElementId = (rowID, columnID) => `c${rowID}-${columnID}`;

class ProjectVanillaView extends GLU.View {
    constructor(root, selector) {
        super(root, selector);
    }

    onValueChange(payload) {
        this.emit(TableActions.UPDATE_CELL, payload);
    }

    updateCell(lastChange) {
        const inputId = getInputElementId(lastChange.rowID, lastChange.columnID);
        const input = document.getElementById(inputId);
        input.value = lastChange.value;
    }

    onViewRender() {
        if (this.data) {
            this.el.innerHTML = '';
            const table = document.createElement('table');
            const thead = document.createElement('thead');
            const tHeadRow = document.createElement('tr');
            tHeadRow.appendChild(document.createElement('th'));
            this.data.columns.forEach((column) => {
                const th = document.createElement('th');
                th.innerHTML = column.label;
                tHeadRow.appendChild(th);
            });
            thead.appendChild(tHeadRow);
            table.appendChild(thead);
            const tbody = document.createElement('tbody');
            this.data.data.slice(0, 100).forEach((row) => {
                const tr = document.createElement('tr');
                row.forEach((element, index) => {
                    const td = document.createElement('td');
                    if (index === 0) {
                        td.innerHTML = element;
                        tr.appendChild(td);
                        return;
                    }
                    const rowID = row[0];
                    const columnID = this.data.columns[index - 1].id;
                    const input = document.createElement('input');
                    input.value = element;
                    input.setAttribute('type', 'text');
                    input.id = getInputElementId(rowID, columnID);
                    input.addEventListener('blur', event => {
                        this.onValueChange({
                            value: event.target.value,
                            rowID,
                            columnID
                        });
                    });
                    td.appendChild(input);
                    tr.appendChild(td);
                });
                tbody.appendChild(tr);
            });
            table.appendChild(tbody);


            this.el.appendChild(table);
        }
    }
}

export default ProjectVanillaView;
