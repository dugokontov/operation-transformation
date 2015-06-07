import GLU from 'glu.js';
import RootView from '/pages/root/RootView';
import RootViewController from '/pages/root/RootViewController';
import ProjectsView from '/pages/projects/ProjectsView';
import ProjectsViewController from '/pages/projects/ProjectsViewController';
import ProjectVanillaView from '/pages/project/ProjectVanillaView';
import ProjectViewController from '/pages/project/ProjectViewController';

let routes = new GLU.Router();

routes.enableHashNavigation();

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
    view: ProjectVanillaView
  }]
});

export default routes;
