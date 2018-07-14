import React,{Component} from 'react'

class LinkButton extends React.Component {
    constructor(props) {
        super(props);
    }

    handleClick = () => {
        console.log('this is:', this);
        console.log('my name is:',this.props.name);
    }

    render() {
        return (
            <button onClick={this.handleClick}>
                Click me
            </button>
        )
    }
}

export default LinkButton;