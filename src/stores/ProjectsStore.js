import GLU from 'glu.js';
import request from 'superagent';
import ProjectsActions from '/actions/ProjectsActions';
import TableActions from '/actions/TableActions';
import OT from '../../ot/ot';

class ProjectsStore extends GLU.Store {
    constructor() {
        super();

        this._projects = [];
        this._currentProject = [];
        this._identities = {};

        this.bindActions(
            ProjectsActions.QUERY, this.query, [],
            ProjectsActions.GET_PROJECT, this.getProject, []
        );
    }

    query(queryParams) {
        request
            .get('https://dev-datahub.socialexplorer.com/data/Search/Table')
            .query(queryParams)
            .withCredentials()
            .end((err, res) => {
                if (err) {
                    console.error(err);
                    return;
                }
                this._projects = res.body;
                this.emitChange();
            });
    }

    getProject(queryParams) {
        let socket = new WebSocket('ws://' + window.location.hostname + ':8080', queryParams.projectID);
        socket.onmessage = (event) => this.ot.processRequest(event.data);
        var emitChange = () => this.emitChange();
        this.ot = new OT({
            onInit: emitChange,
            onUserPositionChange: emitChange
        });

        this.ot.onModelChange(TableActions.UPDATE_CELL, emitChange);
        this.ot.onModelChange(TableActions.ADD_ROW, emitChange);
        this.ot.onModelChange(TableActions.DELETE_ROW, emitChange);
    }

    get data() {
        return this.ot.getData();
    }

    get usersPosition() {
        return this.ot.getUsersPostion();
    }

    get projects() {
        return this._projects;
    }

    get currentProject() {
        return this._currentProject;
    }
}

export default new ProjectsStore();
