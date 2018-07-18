import React from 'react'
import ReactDom from 'react-dom'
import TicTacToe from './component/Tic_Tac_Toe'
import 'css/tic_tac_toe.css'

const box = document.getElementById("box");

ReactDom.render(<TicTacToe />,box);