import React,{ Component } from 'react'

class NameForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value:'',
            tvalue:"欢迎参加，古法小榨、领香中国，主题促销活动，胡姬花古法小榨花生油，传承1918年技艺精髓，选取山东上品花生，重现难以超越的花生香，品尝古法小榨，享受品质生活。",
            isGoing: true,
            numberOfGuests: 2,
            src:'./picked.png'
        };

        this.handleChange = this.handleChange.bind(this);
        this.handletChange = this.handletChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
    }

    handleChange(event) {
        console.log('changing value');
        this.setState({value: event.target.value.toUpperCase()});
    }

    handleInputChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        this.setState({
            [name]:value
        })
    }

    handletChange(event) {
        console.log('changing tvalue');
        this.setState({tvalue: event.target.value});
    }

    handleSubmit(event) {
        console.log('follwed will be submmitted:');
        console.log(JSON.stringify(this.state,0,2));
        console.log(this.input.value);
        console.log(this.fileInput.files[0].name);
        event.preventDefault();
    }

    handleSubmitClick = () => {
        const name = this._name.value;
        // do something with `name`
        console.log(name);
    }

    render() {
        return (
            <form onSubmit={this.handleSubmit}>
                <label>
                    Name:
                    <input type="text" value={this.state.value} onChange={this.handleChange} />
                    Content:
                    <textarea value={this.state.tvalue} onChange={this.handletChange}/>
                </label>
                <br />
                <label>
                    Is going:
                    <input 
                        name="isGoing"
                        type="checkbox"
                        checked={this.state.isGoing}
                        onChange={this.handleInputChange}
                     />
                </label>
                <br />
                <label>
                    Number of guests:
                    <input 
                        name="numberOfGuests"
                        type="number"
                        value={this.state.numberOfGuests}
                        onChange={this.handleInputChange}
                    />
                </label>
                <br />
                <h2>------非受控组件------</h2>
                <input 
                    defaultValue="Bob"
                    type="text"
                    ref={input => this.input = input} />
                <br />
                <input
                    type="file"
                    ref={input => this.fileInput = input}
                />
                <br />
                <input type="submit" value="Submmit" />
                <h4>Uncontrolled--arrow way</h4>
                <input type="text" ref={input => this._name = input} />
                <button onClick={this.handleSubmitClick}>Sign up</button>
                <img src={this.state.src} />
            </form>
        )
    }
}

export default NameForm;