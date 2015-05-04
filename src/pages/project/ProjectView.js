import GLU from 'glu.js';
import React from 'react';
import GridViewReact from '/components/grid/GridViewReact';
import TableActions from '/actions/TableActions';

class ProjectView extends GLU.View {
    constructor(root, selector) {
        super(root, selector);
    }

    onValueChange(payload) {
        this.emit(TableActions.UPDATE_CELL, payload);
    }

    onViewRender() {
        if (this.data) {
            React.render(<GridViewReact
                columns={this.data.columns}
                data={this.data.data}
                onValueChange={this.onValueChange.bind(this)}/>, this.el);
        }
    }
}

export default ProjectView;
