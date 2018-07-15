import React from 'react';
import ReactDOM from 'react-dom';
import App from './component/App';
import LearnBox from './component/LearnBox';
import Clock from './component/Clock';
import Toggle from './component/Toggle';
import LinkButton from './component/LinkButton';
import LoggingButton from './component/LoggingButton';
import Proper from './component/Propper';
import Greeting from './component/Greeting';
import LoginControl from './component/LoginControl';
import Mailbox from './component/Mailbox';
import Page from './component/Page';
import NumberList from './component/NumberList';
import Blog from './component/Blog';
import NameForm from './component/NameForm';
import FlavorForm from './component/FlavorForm';
import Calculator from './component/Calculator';
import WelcomeDialog from './component/WelcomeDialog';
import SignUpDialog from './component/SignUpDialog';

const box = document.getElementById('box');
const messages = ['React','Re:React','Re:Re:React'];
const numbers = [1,2,3,4,5];
const posts = [
    {id: 1, title: 'Hello World', content: 'Welcome to learning React!'},
    {id: 2, title: 'Installation', content: 'You can install React from npm.'}
];

ReactDOM.render(<SignUpDialog title="开奖啦！" message="一分钟内开奖！" posts={posts} />, box);