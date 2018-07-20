import React from 'react';
import Child from './Child';

class Father extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            func: 'show my lifeCycle...',
            info: '一分钟后,来个红包^_^',
            second: 60,
            showPack: false
        };
    }

    componentWillMount() {
        console.log(this.state.func);
        console.log('parent componentWillMount');
    }

    componentDidMount() {
        console.log('parent componentDidMount');
        this.timeId1 = window.setTimeout(() => {
            this.setState({
                info: '您的红包即将到站...'
            });
        }, 55000);

        this.timeId2 = window.setTimeout(() => {
            this.setState({
                info: '您收到的红包金额如下：',
                showPack: true
            });
        }, 60000);

        this.itvId = window.setInterval(() => {
            this.setState((prevState, props) => ({
                second: prevState.second - props.dec
            }));
        }, 1000);
    }

    shouldComponentUpdate() {
        console.log('parent shouldComponentUpdate');
        return true;
    }

    componentDidUpdate() {
        console.log('parent componentDidUpdate');
    }

    componentWillUnmount() {
        alert('parent componentWillUnmount');
        this.timeId1 && clearTimeout(this.timeId1);
        this.timeId2 && clearTimeout(this.timeId2);
        this.itvId && clearInterval(this.itvId);
    }

    render() {
        console.log('parent render');
        return (
            <div>
                <Child showPack={this.state.showPack} info={this.state.info} curSecondStr={`00:00:${this.state.second}`} />
            </div>
        );
    }
}

export default Father;
