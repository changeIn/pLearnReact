import React from 'react';
import { connect } from 'react-redux';
import { PropTypes } from 'prop-types';
import { addTodo } from '../actions';

const AddTodoElm = ({ dispatch }) => {
    let input;

    return (
        <div>
            <form
                onSubmit={e => {
                    e.preventDefault();
                    if (!input.value.trim()) {
                        return;
                    }
                    dispatch(addTodo(input.value));
                    input.value = '';
                }}
            >
                <input
                    ref={node => {
                        input = node;
                    }}
                />
                <button type='submit'>
                    Add Todo
                </button>
            </form>
        </div>
    );
};

AddTodoElm.propTypes = {
    dispatch: PropTypes.func.isRequired
};

const AddTodo = connect()(AddTodoElm);

export default AddTodo;
