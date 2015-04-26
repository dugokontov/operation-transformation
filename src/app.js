import routes from './routes';
import CurrentUserStore from './stores/CurrentUserStore';

let App = {
  init: function () {
    let cb = function () {
      routes.start();
      CurrentUserStore.offChange(cb);
    };
    CurrentUserStore.onChange(cb);
  }
};

export default App;
