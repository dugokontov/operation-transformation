import GLU from 'glu.js';
import ProjectsActions from './ProjectsActions';

class ProjectsActionsCreator {
    static query(payload) {
        GLU.bus.emitAction(ProjectsActions.QUERY, payload);
    }

    static addNew(payload) {
        GLU.bus.emitAction(ProjectsActions.ADD_NEW, payload);
    }

    static getProject(payload) {
        GLU.bus.emitAction(ProjectsActions.GET_PROJECT, payload);
    }

    static deleteProject(payload) {
        GLU.bus.emitAction(ProjectsActions.DELETE_PROJECT, payload);
    }
}

export default ProjectsActionsCreator;
