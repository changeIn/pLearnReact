const visibilityFilter = (state = 'SHOW_ALL', action) => {
    console.log('action：', action);
    let newState;
    switch (action.type) {
        case 'SET_VISIBILITY_FILTER':
            newState = action.filter;
            break;
        default:
            newState = state;
    }
    console.log('newState：', JSON.stringify(newState, 0, 2));
    return newState;
};

export default visibilityFilter;
