import React from 'react';
import { render } from 'react-dom';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import 'css/industry/industryTrend.scss';
import Capp from './containers/Capp.js';
import reducer from './reducers/reducer.js';

const store = createStore(reducer, applyMiddleware(thunk));

render(<Provider store={store}><Capp /></Provider>, document.getElementById('react-content'), () => { });
