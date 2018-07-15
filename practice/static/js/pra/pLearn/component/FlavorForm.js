import React,{Component} from 'react';

class FlavorForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {value: 'cocount'};

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        console.log('changed');
        this.setState({value:event.target.value});
    }

    handleSubmit(event) {
        alert('Your favorate flavor is:' + this.state.value);
        event.preventDefault();
    }

    render() {
        return (
            <form onSubmit={this.handleSubmit}>
                <label>
                    Pick your favorate flavor:
                    <select value={this.state.value} onChange={this.handleChange}>
                        <option value="grapefruit">Grapefruit</option>
                        <option value="lime">Lime</option>
                        <option value="cocount">Cocount</option>
                        <option value="mango">Mango</option>
                    </select>
                </label>
                <input type="submit" value="选好了!" />
            </form>
        )
    }
}

export default FlavorForm;