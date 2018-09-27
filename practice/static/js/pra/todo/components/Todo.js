import React from 'react';
import PropTypes from 'prop-types';

const Todo = ({ onClick, completed, text }) => (
    <li>
        <div
            onClick={onClick}
            style={{
                textDecoration: completed ? 'line-throgh' : 'none'
            }}
        >
            {text}
        </div>
    </li>
);

Todo.propTypes = {
    onClick: PropTypes.func.isRequired,
    completed: PropTypes.bool.isRequired,
    text: PropTypes.string.isRequired
};

export default Todo;
