import React from 'react';

function RedPackNumbers(props) {
    var numbers = props.numbers
    return (
        <div>
            <h4>{props.title}</h4>

        </div>
    )
}
class RedPackBar extends React.Component {

    shouldComponentUpdate() {
        return true;
    }

    render() {
        return (
            <div>
                <RedPackNumbers />
                <TimerControl />
                <AmtList />
            </div>
        )
    }
}

export default RedPackBar;
