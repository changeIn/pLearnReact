const todos = (state = [], action) => {
    console.log('action：', action);
    let newState;
    switch (action.type) {
        case 'ADD_TODO':
            newState = [
                ...state,
                {
                    id: action.id,
                    text: action.text,
                    completed: false
                }
            ];
            break;
        case 'TOGGLE_TODO':
            newState = state.map(todo => (
                (todo.id === action.id) ?
                    {
                        ...todo,
                        completed: !todo.completed
                    }
                    :
                    todo
            ));
            break;
        default:
            newState = state;
    }
    console.log('newState：', JSON.stringify(newState, 0, 2));
    return newState;
};

export default todos;
