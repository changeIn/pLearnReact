import React from 'react'

class AmtList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
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
            <div className={this.state.amtListClass}>

                <table>
                    <ListHead items={props.fields} handleSort={props.sort} />
                    <ListBody items={props.fields} contents={props.amtList} />
                </table>
            </div>
        )
    }

    handleSort(way) {
        console.log(way);
        this.state.hisPackAmtList.sort((a,b) => 
            way == 'asc' ? a.PackAmt > b.PackAmt : a.PackAmt < b.PackAmt
        )
        console.log(this.state.hisPackAmtList)
        this.state.hisPackAmtList.push({
            PeroidNum: '07221159',
            PackAmt: 37257,
            OpenTime: '19:20:05'
        })
    }
}

export default AmtList;