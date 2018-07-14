import React, { Component } from 'react';
import Greeting from './Greeting'

function LoginButton(props) {
    return (
        <button onClick={props.onClick}>
            Login
        </button>
    )
}

function LogoutButton(props) {
    return (
        <button onClick={props.onClick}>
            Logout
        </button>
    )
}

class LoginControl extends React.Component {
    constructor(props) {
        super(props);
        this.handleLoginClick = this.handleLoginClick.bind(this);
        this.handleLogoutClick = this.handleLogoutClick.bind(this);
        this.state = {isLoggedIn: true};
    }

    handleLoginClick() {
        console.log('Login!');
        this.setState({isLoggedIn: true});
    }

    handleLogoutClick() {
        console.log('Logout!');
        this.setState({isLoggedIn: false});
    }

    render() {
        const isLoggedIn = this.state.isLoggedIn;

        console.log('render...');

        let button = null;
        // if(isLoggedIn) {
        //     button = <LogoutButton onClick={this.handleLogoutClick} />
        // } else {
        //     button = <LoginButton onClick={this.handleLoginClick} />
        // }

        return (
            <div>
                <Greeting isLoggedIn={isLoggedIn} />
                {/* {button} */}
                {isLoggedIn ? (
                    <LogoutButton onClick={this.handleLogoutClick} />
                ) : (
                    <LoginButton onClick={this.handleLoginClick} />
                )}
            </div>
        )
    }
}

export default LoginControl;
