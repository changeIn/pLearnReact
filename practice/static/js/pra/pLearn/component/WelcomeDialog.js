import React from 'react'

function FancyBorder(props) {
    return (
        <div className={'FancyBorder FancyBorder-' + props.color}>
            {props.children}
        </div>
    );
}

function Dialog(props) {
    return (
        <FancyBorder color="blue">
        <h1 className="Dialog-title">
            {props.title}
        </h1>
        <p className="Dialog-message">
            {props.message}
        </p>
        </FancyBorder>
    );
}

function WelcomeDialog(props) {
    return (
        <Dialog
            title={props.title}
            message={props.message} />
    );
}

export default WelcomeDialog;