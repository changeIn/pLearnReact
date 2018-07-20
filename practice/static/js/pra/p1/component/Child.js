import React from 'react';
import PropTypes from 'prop-types';

function genRandAmt() {
    let ret = '';
    for (let i = 0; i < 5; i++) {
        ret += Math.floor(Math.random() * 10);
    }
    return ret;
}

class Child extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            amt: 0,
            redBagTime: '00:00:00'
        };
    }

    componentWillMount() {
        console.log('       child componentWillMount');
        this.setState({
            name: 'come on, my red package!'
        });
    }

    componentDidMount() {
        console.log('       child componentDidMount');
        this.itvId = window.setInterval(() => {
            const t = new Date();
            this.setState({
                amt: genRandAmt(),
                redBagTime: t.toLocaleTimeString()
            });
        }, 60000);
    }

    componentWillReceiveProps() {
        // this.setState({
        //     amt: '0'
        // });
        console.log('       child componentWillReceiveProps');
    }

    shouldComponentUpdate() {
        console.log('       child shouldComponentUpdate');
        return true;
    }

    componentWillUpdate() {
        console.log('       child componentWillUpdate');
    }

    componentDidUpdate() {
        console.log('       child componentDidUpdate');
    }

    componentWillUnmount() {
        console.log('       child componentWillUnmount');
        this.setState({
            amt: '0'
        });
        this.itvId && clearInterval(this.itvId);
    }

    render() {
        console.log('       child render');
        return (
            <div>
                <h3>{this.state.name}</h3>
                {!this.props.showPack
                    ? (
                        <p>
                            <span>
                                {this.props.info}
                            </span>
                            <span>
                                {this.props.curSecondStr}
                            </span>
                        </p>
                    )
                    : (
                        <p>
                            <span>
                                {this.state.amt}
                            </span>
                            <span>
                                {this.state.redBagTime}
                            </span>
                        </p>
                    )}
            </div>
        );
    }
}

Child.propTypes = {
    info: PropTypes.string.isRequired,
    curSecondStr: PropTypes.string.isRequired,
    showPack: PropTypes.bool.isRequired
};

export default Child;
