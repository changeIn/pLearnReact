import React from 'react'

class MyClassList extends React.Component {
    constructor(props) {
        super(props);
    }

    componentWillReceiveProps(newProps) {
        console.log(newProps);
    }

    render() {
        alert('child render')
        return (
            <div>
                <button onClick={this.props.sortClick.bind(null)}>{this.props.sortName}</button>
                <button onClick={this.props.modifyClick.bind(null,2)}>改值</button>
                <ul>
                    {/* 如果列表可以重新排序，我们不建议使用索引来进行排序，因为这会导致渲染变得很慢。 */}
                    {
                        this.props.data.map((a,i) => 
                            <li key={i}>{a}</li>
                        )
                    }
                </ul>
            </div>
        )
    }
    
}

class Test extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            amtArr: [1,3,6,2,5,8,7],
            desSort: true
        }
        this.handleSort = this.handleSort.bind(this);
        this.modifyClick = this.modifyClick.bind(this);
    }

    handleSort() {
        const copy_arr = Object.assign([],this.state.amtArr)
        // this.state.amtArr.sort((a,b) => a < b)  直接修改state，无法触发页面重新渲染 !!!
        this.state.desSort
        ?   this.setState({
                amtArr: copy_arr.sort((a,b) =>
                    a < b
                ),
                desSort: !this.state.desSort
            })
        :   this.setState({
                amtArr: copy_arr.sort((a,b) =>
                    a > b
                ),
                desSort: !this.state.desSort
            })
    }

    modifyClick() {
        const copy_arr = Object.assign([],this.state.amtArr)
        // this.setState({
        //     amtArr: copy_arr.map((a) =>
        //         a*a
        //     )
        // })

        this.setState({
            amtArr: copy_arr.filter(a => a % 2)
        })
    }

    shouldComponentUpdate() {
        return true
    }

    render() {
        alert('father render');
        return (
            <div>
                <h3>小测试</h3>
                <MyClassList 
                    sortName={this.state.desSort ? '降序' : '升序'}
                    data={this.state.amtArr}
                    sortClick={this.handleSort}
                    modifyClick={this.modifyClick}
                />
            </div>
        )
    }
}

export default Test;