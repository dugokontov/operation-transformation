import GLU from 'glu.js';
import request from 'superagent';
import CurrentUserActions from '/actions/CurrentUserActions';

class CurrentUserStore extends GLU.Store {
    constructor() {
        super();

        this.bindActions(
            CurrentUserActions.LOG_OUT, this.logOut, []
        );

        this.resetUser();

        request
            .get('https://dev-datahub.socialexplorer.com/auth/Session')
            .withCredentials()
            .end((err, res) => {
                if (err || res.body.id === null) {
                    this.resetUser();
                    this.emitChange();
                    return;
                }
                let userID = res.body.id;
                request
                    .get(`https://dev-datahub.socialexplorer.com/auth/User/${userID}`)
                    .withCredentials()
                    .end((err, userRes) => {
                        if (err) {
                            this.resetUser();
                            this.emitChange();
                            return;
                        }
                        request
                            .get('https://dev-datahub.socialexplorer.com/auth/Organization')
                            .withCredentials()
                            .end((err, res) => {
                                if (err) {
                                    this.resetUser();
                                    this.emitChange();
                                    return;
                                }
                                this._userOrganizations = res.body;
                                this._currentUser = userRes.body;
                                this._isLoggedIn = true;
                                this.emitChange();
                            });
                    });
            });
    }

    logOut() {
        request
            .del('https://dev-datahub.socialexplorer.com/auth/Session')
            .withCredentials()
            .end(() => {
                this.resetUser();
                this.emitChange();
            });
    }

    resetUser() {
        this._isLoggedIn = false;
        this._currentUser = {};
        this._userOrganizations = [];
    }

    get isLoggedIn() {
        return this._isLoggedIn;
    }

    get currentUser() {
        return this._currentUser;
    }

    get userOrganizations() {
        return this._userOrganizations;
    }
}

export default new CurrentUserStore();
