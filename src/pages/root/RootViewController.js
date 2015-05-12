import GLU from 'glu.js';

class RootViewController extends GLU.ViewController {
  constructor(view) {
    super(view);
  }

  static beforeRouteInvoke(params, next) {
    if (params.handlerCount === 1) {
      let routes = require('/routes');

      routes.navigateTo('/projects');
    } else {
      next();
    }
  }
}

export default RootViewController;
