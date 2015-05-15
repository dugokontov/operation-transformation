'use strict';
import GLU from 'glu.js';
import request from 'superagent';
import ProjectsActions from '/actions/ProjectsActions';
import TableActions from '/actions/TableActions';
import OT from '../../ot/ot';
import tableChangeRules from '../../ot/table';

class ProjectsStore extends GLU.Store {
    constructor() {
        super();

        this._projects = [];
        this._currentProject = [];
        this._identities = {};

        this.bindActions(
            ProjectsActions.QUERY, this.query, [],
            ProjectsActions.GET_PROJECT, this.getProject, [],
            TableActions.UPDATE_CELL, this.updateCell, [],
            TableActions.ADD_ROW, this.updateRow, [],
            TableActions.DELETE_ROW, this.deleteRow, [],
            TableActions.USER_CHANGE_POSITION, this.userChangePosition, []
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
        this._socket = new WebSocket('ws://' + window.location.hostname + ':28735', queryParams.projectID);
        this._socket.onmessage = (event) => {
            this.ot.processRequest(event.data);
        };
        var emitChange = () => this.emitChange();
        this.ot = new OT({
            onInit: emitChange,
            onUserPositionChange: emitChange
        });
        tableChangeRules(this.ot);

        this.ot.onModelChange(TableActions.UPDATE_CELL, emitChange);
        this.ot.onModelChange(TableActions.ADD_ROW, emitChange);
        this.ot.onModelChange(TableActions.DELETE_ROW, emitChange);
    }

    triggerRequest(action, payload, skipExecute) {
        var message = this.ot.createMessage(action, payload);
        var request = JSON.parse(message);
        if (!skipExecute) {
            console.log(JSON.stringify(request));
            this.ot.execute(request);
        }
        this._socket.send(message);
        this.emitChange();
    }

    updateCell(payload) {
        this.triggerRequest(TableActions.UPDATE_CELL, payload);
    }

    updateRow(payload) {
        this.triggerRequest(TableActions.ADD_ROW, payload);
    }

    deleteRow(payload) {
        this.triggerRequest(TableActions.DELETE_ROW, payload);
    }

    userChangePosition(payload) {
        this.triggerRequest(TableActions.USER_CHANGE_POSITION, payload, true);
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
