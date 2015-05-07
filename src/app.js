import routes from './routes';
import CurrentUserStore from './stores/CurrentUserStore';
import React from 'react/addons';

let App = {
  init: function () {
    let cb = function () {
      routes.start();
      window.TestUtils = React.addons.TestUtils;
      CurrentUserStore.offChange(cb);
    };
    CurrentUserStore.onChange(cb);
  }
};

export default App;
