import React,{Component} from 'react'

class Proper extends React.Component {
    constructor() {
        super();
        this.state = {name: 'Hello,world!'}
    }

    preventPop(name,e) {
        e.preventDefault();
        alert(name);
        alert(this.state.name);
    }

    render() {
        return (
            <div>
                <p>hello</p>
                {/*Pass params via bind() method*/}
                <a href="https://react.org" onClick={this.preventPop.bind(this,'this.state.name')}>Click me</a>
            </div>
        )
    }
}

export default Proper;