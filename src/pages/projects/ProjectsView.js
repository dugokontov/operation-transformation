import GLU from 'glu.js';
import React from 'react';
import Link from '/components/link/LinkView';

class ProjectsView extends GLU.View {
    constructor(root, selector) {
        super(root, selector);
    }

    onViewRender() {
      let projects = this.projects.map(project => <li>
          <Link href={`/project/${project.id}`}>{project.title}</Link>
        </li>);
      React.render(
        <ul>{projects}</ul>, this.el);
    }
}

export default ProjectsView;
