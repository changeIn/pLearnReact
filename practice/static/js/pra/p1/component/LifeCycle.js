import React from 'react';
import Parent from './Parent';

class LifeTime extends React.Component {
    constructor(props) {
        super(props);
        this.name = 'show my life';
        console.log('constructor');
        this.state = {
            dec: 1,
            hasChild: true
        };
        this.myRef = React.createRef();
    }

    componentDidMount() {
        console.log('Top componentDidMount');
        this.timeId1 = window.setTimeout(() => {
            this.setState(prevState => ({
                hasChild: !prevState.hasChild
            }));
        }, 70000);
    }

    shouldComponentUpdate() {
        console.log('top shouldComponentUpdate');
        return true;
    }

    render() {
        return (
            <React.Fragment>
                {
                    this.state.hasChild
                        ? <Parent ref={this.myRef} dec={this.state.dec} />
                        : <h3>红包活动已结束，谢谢参与!</h3>
                }
            </React.Fragment>
        );
    }
}

export default LifeTime;
