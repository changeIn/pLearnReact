import React from 'react';

function ListItem(props) {
    return (
        <li>
            { props.value }
        </li>
    );
}

function NumberList(props) {
    const numbers = props && props.numbers;
    const listItem = (numbers && numbers instanceof Array && numbers.length) ? numbers.map(number => <ListItem key={number.toString()} value={number} />) : (<li>暂无数据...</li>);
    return (
        <ul>{listItem}</ul>
    );
}

export default NumberList;
