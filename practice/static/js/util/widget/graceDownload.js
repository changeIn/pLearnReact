/**
 * Created by chenhaifeng on 2018/1/11.
 */

/*
config:{
        url: '/a/b/c',                      // 下载url
        method:'POST',
        target:'_self',
        param: {                            // 附加参数
            ids : '1234,3445',
            date : '2018-09-09',
            abc : 'ssss'
        }
    }
*/
import React,{ Component } from 'react'
import ReactDom  from 'react-dom'
import PropTypes from 'prop-types'
import "css/widget/graceDownload.scss"


class GraceDownLoad extends Component{
	static propTypes = {
        'download-config':PropTypes.object.isRequired
    };
	constructor(props){
	    super(props);
	}

    render(){
        let config = this.props['download-config'];
        config.method = config.method || "POST";
        config.target = config.target || "_self";
        let paramsInputs = [];
        let index = 0;

        for (let p in config.param) {
            paramsInputs.push(<input key={`${config.param[p]}-${index}`} type='hidden' value={config.param[p]} name={p} />);
            index++;
        }
		return (
            <div className="grace-down-load" onClick={this._downLoadData}>
                <span className="download-data">下载数据</span>
                <span className="download-data-img"> </span>
                <form ref="refForm" action={config.url} method={config.method} target={config.target}>
                    {paramsInputs}
                </form>
            </div>
		)
	}
    shouldComponentUpdate(nextProps,nextState){
        return nextProps['download-config'] !== this.props['download-config'] ;
    }
    _downLoadData = () => {
        let form = ReactDom.findDOMNode(this.refs.refForm);
        form.submit();
    }
}

export default GraceDownLoad;