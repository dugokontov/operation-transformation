import GLU from 'glu.js';
import ProjectsStore from '/stores/ProjectsStore';
import ProjectsActionCreator from '/actions/ProjectsActionCreator';

class ProjectViewController extends GLU.ViewController {
    constructor(view, params) {
        super(view);

        this.view.project = null;
        this.onParamsChange(params);
        ProjectsStore.onChange(this.onStoreChange, this);
    }

    onStoreChange() {
        this.view.project = ProjectsStore.currentProject;
        this.view.render();
    }

    onParamsChange(params) {
        ProjectsActionCreator.getProject({
            projectID: params.projectID
        });
    }

    destroy() {
        ProjectsStore.offChange(this.onStoreChange);
    }
}

export default ProjectViewController;
