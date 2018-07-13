import React, { Component } from 'react';

const lifecycle = [
    'displayName',
    'propTypes',
    'contextTypes',
    'childContextTypes',
    'mixins',
    'statics',
    'defaultProps',
    'constructor',
    'getDefaultProps',
    'state',
    'getInitialState',
    'getChildContext',
    'getDerivedStateFromProps',
    'componentWillMount',
    'UNSAFE_componentWillMount',
    'componentDidMount',
    'componentWillReceiveProps',
    'UNSAFE_componentWillReceiveProps',
    'shouldComponentUpdate',
    'componentWillUpdate',
    'UNSAFE_componentWillUpdate',
    'getSnapshotBeforeUpdate',
    'componentDidUpdate',
    'componentDidCatch',
    'componentWillUnmount'
];

class LifeTime extends Component {
    constructor(props) {
        super(props);
        this.name = 'show my life';
        console.log('constructor');
        this.state = {
            float: 'right',
            width: '100px',
            height: '100px'
        };
        this.user = {
            firstName: 'Harper',
            lastName: 'Perez',
            address: 'bei cheng',
            chatHead: 'https://avatars0.githubusercontent.com/u/26423601?s=40&v=4'
        };
    }
    componentWillMount() {
        console.log('componentWillMount');
    }
    componentDidMount() {
        console.log('componentDidMount');
        const self = this;
        window.setTimeout(() => {
            self.setState({
                width: '50px',
                height: '50px'
            });
        }, 5000);
    }
    componentWillReceiveProps() {
        console.log('componentWillReceiveProps');
    }
    shouldComponentUpdate() {
        console.log('shouldComponentUpdate');
        return true;
    }
    componentWillUpdate() {
        console.log('componentWillUpdate');
    }
    componentDidUpdate() {
        console.log('componentDidUpdate');
    }
    componentDidCatch() {
        console.log('componentDidCatch');
        this.name = 'about to over!';
    }
    componentWillUnmount() {
        console.log('componentWillUnmount');
    }
    formatName() {
        return `${this.user.firstName} ${this.user.lastName}`;
    }
    showGreeting() {
        return <h1 style={{ margin: 0 }}>Hello, Stranger.{this.user.address}</h1>;
    }
    render() {
        console.log('render');
        return (
            <div style={{ display: 'block' }}>
                <div
                    index='0'
                    style={{
                        float: this.state.float,
                        border: '1px solid red'
                    }}
                >
                    <img
                        alt='头像'
                        src={this.user.chatHead}
                        style={{
                            width: this.state.width,
                            height: this.state.height
                        }}
                    />
                </div>
                {this.showGreeting()}
            </div>
        );
    }
}

export default LifeTime;
