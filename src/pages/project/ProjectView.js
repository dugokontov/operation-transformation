import GLU from 'glu.js';
import React from 'react';

class ProjectView extends GLU.View {
    constructor(root, selector) {
        super(root, selector);
    }

    onViewRender() {
        if (this.data) {
            React.render(
              <div>
                {this.data}
              </div>, this.el);
        }
    }
}

export default ProjectView;
