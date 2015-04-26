import GLU from 'glu.js';
import request from 'superagent';
import ProjectsActions from '/actions/ProjectsActions';

class ProjectsStore extends GLU.Store {
    constructor() {
        super();

        this._projects = [];
        this._currentProject = [];
        this._identities = {};

        this.bindActions(
            ProjectsActions.QUERY, this.query, [],
            ProjectsActions.ADD_NEW, this.addNew, [],
            ProjectsActions.GET_PROJECT, this.getProject, [],
            ProjectsActions.DELETE_PROJECT, this.deleteProject, []
        );
    }

    addNew(projectData) {
        request
            .post('https://dev-datahub.socialexplorer.com/vizwiz/Project')
            .send(projectData)
            .withCredentials()
            .end((err, res) => {
                if (err) {
                    console.error(err);
                    return;
                }
                var project = res.body;
                this._populateMissingIdentities([project])
                    .then(() => {
                        this._projects.unshift(res.body);
                        this.emitChange();
                    });
            });
    }

    query(queryParams) {
        request
            .get('https://dev-datahub.socialexplorer.com/vizwiz/Search/Project')
            .query(queryParams)
            .withCredentials()
            .end((err, res) => {
                if (err) {
                    console.error(err);
                    return;
                }
                this._projects = res.body;
                this._populateMissingIdentities(this._projects)
                    .then(() => this.emitChange());
            });
    }

    getProject(queryParams) {
        request
            .get(`https://dev-datahub.socialexplorer.com/vizwiz/Project/${queryParams.projectID}`)
            .withCredentials()
            .end((err, res) => {
                if (err) {
                    console.error(err);
                    return;
                }
                this._currentProject = res.body;
                this._populateMissingIdentities([this._currentProject])
                    .then(() => this.emitChange());
            });
    }

    deleteProject(project) {
        this._currentProject = null;
        for (let i = 0; i < this._projects.length; i++) {
            if(this._projects[i].id === project.id) {
                this._projects.splice(i, 1);
                break;
            }
        }

        request
            .del(`https://dev-datahub.socialexplorer.com/vizwiz/Project/${project.id}`)
            .withCredentials()
            .end((err) => {
                if (err) {
                    console.error(err);
                    return;
                }
            });

        this.emitChange();
    }

    _populateMissingIdentities(projects) {
        let baseUrl = 'https://dev-datahub.socialexplorer.com/auth/Identity';
        let needToGetOwnerIDs = [];
        let alreadyCachedIdentites = Object
            .keys(this._identities)
            .map(key => +key);
        projects.forEach(project => {
            let notAlreadyCached = alreadyCachedIdentites.indexOf(project.ownerID) === -1;
            let notAlreadyMarkedToGet = needToGetOwnerIDs.indexOf(project.ownerID) === -1;
            let notAlreadyRetrieved = !project.owner;
            if (notAlreadyRetrieved && notAlreadyCached && notAlreadyMarkedToGet) {
                needToGetOwnerIDs.push(project.ownerID);
            }
        });
        let requests = needToGetOwnerIDs
            .map(ownerID => {
                let path = `${baseUrl}/${ownerID}`;
                let promise = new Promise((resolve, reject) => {
                    request
                        .get(path)
                        .withCredentials()
                        .end((err, res) => {
                            if (err) {
                                reject(err);
                            }
                            resolve(res.body);
                        });
                });
                return promise;
            });
        return Promise
            .all(requests)
            .then(identities => {
                identities.forEach(identity => {
                    this._identities[identity.id] = identity;
                });
                projects.forEach(project => project.owner = this._identities[project.ownerID]);
            });
    }

    get projects() {
        return this._projects;
    }

    get currentProject() {
        return this._currentProject;
    }
}

export default new ProjectsStore();
