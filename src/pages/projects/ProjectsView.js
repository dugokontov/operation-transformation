import GLU from 'glu.js';

class ProjectsView extends GLU.View {
    constructor(root, selector) {
        super(root, selector);
    }

    redirect(event) {
      let routes = require('/routes');
      event.preventDefault();
      routes.navigateTo(event.target.attributes.href.nodeValue);
    }

    onViewRender() {
      this.el.innerHTML = '';
      const list = document.createElement('ul');
      this.projects.forEach(project => {
        const li = document.createElement('li');
        const link = document.createElement('a');
        link.addEventListener('click', (event) => this.redirect(event));
        link.innerHTML = project.alias;
        link.setAttribute('href', `/project/${project.id}`);
        li.appendChild(link);
        list.appendChild(li);
      });
      this.el.appendChild(list);
    }
}

export default ProjectsView;
