import React,{Component} from 'react'

class LoggingButton extends React.Component {
    constructor(props) {
        super(props);
    }

    handleClick() {
        console.log('this is:',this);
    }

    render() {
        return (
            <button onClick={(e) = this.handleClick(e)}>
                Click me
            </button>
        )
    }
}

export default LoggingButton;