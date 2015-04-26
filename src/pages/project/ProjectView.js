import GLU from 'glu.js';
import React from 'react';

class ProjectView extends GLU.View {
    constructor(root, selector) {
        super(root, selector);
    }

    onViewRender() {
        if (this.project) {
            React.render(
              <div>
                {this.project.title}
              </div>, this.el);
        }
    }
}

export default ProjectView;
