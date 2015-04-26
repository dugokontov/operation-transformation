import React from 'react';

class Link extends React.Component {
    constructor(props) {
        super(props);
    }

    onClick(e) {
        let routes = require('/routes');
        e.preventDefault();
        routes.navigateTo(this.props.href);
    }

    render() {
        return (
            <a
                className={this.props.className}
                href={this.props.href}
                onClick={this.onClick.bind(this)}>
                {this.props.children}
            </a>);
    }
}

export default Link;
