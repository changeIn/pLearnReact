import _extends from "babel-runtime/helpers/extends";
export default function createStore(initialState) {
    let state = initialState;
    let listeners = [];
    function setState(partial) {
        state = _extends({}, state, partial);
        for (let i = 0; i < listeners.length; i++) {
            listeners[i]();
        }
    }
    function getState() {
        return state;
    }
    function subscribe(listener) {
        listeners.push(listener);
        return function unsubscribe() {
            let index = listeners.indexOf(listener);
            listeners.splice(index, 1);
        };
    }
    return {
        setState: setState,
        getState: getState,
        subscribe: subscribe
    };
}