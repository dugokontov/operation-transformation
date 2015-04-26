import GLU from 'glu.js';
import ProjectsActionCreator from '/actions/ProjectsActionCreator';
import ProjectsStore from '/stores/ProjectsStore';
import CurrentUserStore from '/stores/CurrentUserStore';

class ProjectsViewController extends GLU.ViewController {
  constructor(view) {
    super(view);

    if (!CurrentUserStore.isLoggedIn) {
      throw 'You are not logged in or haven\'t passed correct cookies in browser';
    }
    this.view.projects = [];
    ProjectsStore.onChange(this.onProjectListChange, this);

    ProjectsActionCreator.query({
      ownerID: CurrentUserStore.currentUser.id
    });
  }

  onProjectListChange() {
    this.view.projects = ProjectsStore.projects;
    this.view.render();
  }

  destroy() {
    ProjectsStore.offChange(this.onProjectListChange);
  }
}

export default ProjectsViewController;
