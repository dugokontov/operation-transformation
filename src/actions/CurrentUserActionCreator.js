import GLU from 'glu.js';
import CurrentUserActions from './CurrentUserActions';

class CurrentUserActionsCreator {
    static logOut() {
        GLU.bus.emitAction(CurrentUserActions.LOG_OUT);
    }
}

export default CurrentUserActionsCreator;
