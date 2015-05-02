import GLU from 'glu.js';
import React from 'react';
import GridViewReact from '/components/grid/GridViewReact';

class ProjectView extends GLU.View {
    constructor(root, selector) {
        super(root, selector);
    }

    onViewRender() {
        if (this.data) {
            React.render(<GridViewReact
                columns={this.data.columns}
                data={this.data.data}/>, this.el);
        }
    }
}

export default ProjectView;
