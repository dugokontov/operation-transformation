import GLU from 'glu.js';
import ProjectsStore from '/stores/ProjectsStore';
import ProjectsActionCreator from '/actions/ProjectsActionCreator';
import TableActionCreator from '/actions/TableActionCreator';
import TableActions from '/actions/TableActions';

class ProjectViewController extends GLU.ViewController {
    constructor(view, params) {
        super(view);

        this.view.data = null;
        this.onParamsChange(params);
        ProjectsStore.onChange(this.onStoreChange, this);
        this.view.on(TableActions.UPDATE_CELL, TableActionCreator.updateCell);
    }

    onStoreChange() {
        if (!this.view.data) {
            this.view.data = ProjectsStore.data;
            this.view.render();
        } else {
            this.view.updateCell(ProjectsStore.lastChange);
        }
    }

    onParamsChange(params) {
        ProjectsActionCreator.getProject({
            projectID: params.projectID
        });
    }

    destroy() {
        ProjectsStore.offChange(this.onStoreChange);
        this.view.off('updateCell', TableActionCreator.updateCell);
    }
}

export default ProjectViewController;
