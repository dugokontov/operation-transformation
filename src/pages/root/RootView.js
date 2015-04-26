import GLU from 'glu.js';

class RootView extends GLU.View {
    constructor(root, selector) {
        super(root, selector);
    }

    onViewRender() {
      this.el.innerHTML = `<div id="page"></div>`;
    }
}

export default RootView;
