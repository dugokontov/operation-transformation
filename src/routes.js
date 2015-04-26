import GLU from 'glu.js';
import RootView from '/pages/root/RootView';
import RootViewController from '/pages/root/RootViewController';
import ProjectsView from '/pages/projects/ProjectsView';
import ProjectsViewController from '/pages/projects/ProjectsViewController';
import ProjectView from '/pages/project/ProjectView';
import ProjectViewController from '/pages/project/ProjectViewController';

let routes = new GLU.Router();

routes.addRoute({
  path: '/',
  view: RootView,
  controller: RootViewController,
  route: [{
    path: '/projects',
    viewSelector: '#page',
    controller: ProjectsViewController,
    view: ProjectsView
  }, {
    path: '/project/:projectID',
    viewSelector: '#page',
    controller: ProjectViewController,
    view: ProjectView
  }]
});

export default routes;
