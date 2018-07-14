import React from 'react';
import ReactDOM from 'react-dom';
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

const box = document.querySelector('#box');
const messages = ['React','Re:React','Re:Re:React'];

ReactDOM.render(<Mailbox unreadMessages={messages}/>, box);