import React from 'react';
import PropTypes from 'prop-types'

function RedPackAmt(props) {
    return (
        <div className={props.class}>
            <h4>{props.title}</h4>
            <div>{props.amt}</div>
            {/* {
                props.numArr.map((num,i) =>
                    <span key={i}>{num}</span>
                )
            } */}
        </div>
    )
}

function TimerControl(props) {
    return (
        <div className={props.class}>
            <h4>{props.title}</h4>
            {props.curBackingTimeStr}
        </div>
    )
}

function ListTds(props) {
    return (
        <React.Fragment>
            {
                props.type == 'head'
                    ? props.items.map(item =>
                        <td
                            key={item.index}
                            style={{
                                display: item.hide ? 'none' : '',
                                width: item.width ? item.width + '%' : 'auto'
                            }}
                        >
                            {item.name}
                            {
                                item.sortBar
                                ? <ul>
                                    <li className={'asc-sort'} onClick={(e) => props.handleSort('asc', e)}></li>
                                    <li className={'des-sort'} onClick={props.handleSort.bind(null, 'des')}></li>
                                  </ul>
                                : null
                            }
                        </td>
                    )
                    : props.type == 'body' && props.record
                        ? props.items.map((item, i) =>
                            <td
                                key={i}
                                style={{
                                    display: item.hide ? 'none' : '',
                                    width: item.width ? item.width + '%' : 'auto'
                                }}
                            >
                                {props.record[item.field]}
                            </td>
                        )
                        : null
            }
        </React.Fragment>
    )
}

function ListHead(props) {
    return (
        <thead>
            <tr>
                <ListTds items={props.items} type="head" handleSort={props.handleSort} />
            </tr>
        </thead>
    )
}

function ListBody(props) {
    return (
        <tbody>
            {
                props.contents.map(record =>
                    <tr key={record.OpenTime}>
                        <ListTds items={props.items} record={record} type="body" />
                    </tr>
                )
            }
        </tbody>
    )
}

function AmtList(props) {
    return (
        <div className={props.class}>
            <table style={{ width: '100%' }}>
                <ListHead items={props.fields} handleSort={props.sort} />
                <ListBody items={props.fields} contents={props.amtList} />
            </table>
        </div>
    )
}

class RedPackBar extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            headClass: 'headBar',
            redClass: 'ctrl fl bdr',
            timerClass: 'ctrl fr',
            amtListClass: 'hisList',
            peroid: {
                cur: '07210731',
                next: '07210732'
            },
            curPackAmt: 68161,
            backingSecond: 60,
            fields: [
                {
                    index: 0,
                    field: 'PeroidNum',
                    name: '期号',
                    hide: false,
                    width: 20
                },
                {
                    index: 1,
                    field: 'PackAmt',
                    name: '红包金额',
                    hide: false,
                    width: 60,
                    sortBar: true
                },
                {
                    index: 2,
                    field: 'OpenTime',
                    name: '发放时间',
                    hide: false,
                    width: 20
                }
            ],
            hisPackAmtList: [
                {
                    PeroidNum: '07211070',
                    PackAmt: 93514,
                    OpenTime: '17:50:05'
                },
                {
                    PeroidNum: '07211073',
                    PackAmt: 86821,
                    OpenTime: '17:53:05'
                },
                {
                    PeroidNum: '07211074',
                    PackAmt: 88606,
                    OpenTime: '17:54:05'
                }
            ]
        }
        this.handleSort = this.handleSort.bind(this);
    }

    shouldComponentUpdate() {
        return true;
    }

    render() {
        alert('render')
        return (
            <React.Fragment>
                <div
                    className={this.state.headClass}
                >
                    <RedPackAmt
                        class={this.state.redClass}
                        title={`${this.state.peroid.cur}期红包`}
                        amt={utilTool.splitAmts(this.state.curPackAmt)}
                    />
                    <TimerControl
                        class={this.state.timerClass}
                        title={`${this.state.peroid.next}期红包发放倒计时`}
                        curBackingTimeStr={`00:00:${this.state.backingSecond}`}
                    />
                </div>
                <AmtList
                    class={this.state.amtListClass}
                    fields={this.state.fields}
                    amtList={this.state.hisPackAmtList}
                    sort={this.handleSort}
                />
            </React.Fragment>
        )
    }

    // handleSort = (way) => {
    //     console.log(way);
    //     this.state.hisPackAmtList.sort((a,b) => 
    //         way == 'asc' ? a.PackAmt > b.PackAmt : a.PackAmt < b.PackAmt
    //     )
    //     console.log(this.state.hisPackAmtList)
    //     this.state.hisPackAmtList.push({
    //         PeroidNum: '07221159',
    //         PackAmt: 37257,
    //         OpenTime: '19:20:05'
    //     })
    // }

    handleSort(way) {
        console.log(way);
        const tempAmtList =  Object.assign([],this.state.hisPackAmtList);
        this.setState({
            hisPackAmtList: tempAmtList.sort((a,b) => 
                way == 'asc' ? a.PackAmt > b.PackAmt : a.PackAmt < b.PackAmt
            )
        })
        console.log(this.state.hisPackAmtList)
    }
}

const utilTool = {
    splitAmts(amt) {
        return amt;//[6,8,1,6,1]
    }
}

export default RedPackBar;
