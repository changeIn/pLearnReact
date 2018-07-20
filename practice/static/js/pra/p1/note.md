# 练习一 生命周期练手

熟悉React生命周期钩子函数，自己设计一个组件，将下面的钩子函数全部触发，并观察以下问题：

* 钩子函数的执行次序是什么？
  宏观分为：装配、更新、卸载
  微观主要包括：将要装配、渲染、已装配、将要接收新属性值、是否更新、将要更新、已更新、已卸载

* 如果组件结构有多层，则父组件和子组件钩子函数的执行次序是什么？
  父组件的装配期包括了子组件的装配期
  父组件的重渲期包括了子组件的更新期

* 在哪些钩子函数内可以调用setState方法，哪些不可以，不可以的话是什么表现。
  在componentWillMount钩子中调用：有效，但无法获取与UI相关的状态
  在componentDidMount钩子中调用：最佳
  在componentWillReceiveProps钩子中调用：有效
  在三个Update钩子中调用会造成死循环
  在componentWillUnmount钩子中调用，没有意义

* 如何区分某次render是由组件自身setState触发的还是由父组件触发的？
  是否触发过钩子componentWillReceiveProps ? 父组件触发 ：子组件触发

* constructor函数中的super(props)可否省略？constructor函数本身可否省略？
  类组件中，构造函数constructor可有可无，但一旦写constructor则必需加supper(props)

> 需阅读React官方文档：[React.Component](https://doc.react-china.org/docs/react-component.html#shouldcomponentupdate)


<table>
  <tr>
    <th>钩子函数</th>
    <th>触发时机</th>
    <th>可否调用setState</th>
  </tr>
  <tr>
    <td >constructor</td>
    <td></td>
    <td></td>
  </tr>
  <tr>
    <td >componentWillMount</td>
    <td></td>
    <td></td>
  </tr>
  <tr>
    <td >render</td>
    <td></td>
    <td></td>
  </tr>
  <tr>
    <td >componentDidMount</td>
    <td></td>
    <td></td>
  </tr>
  <tr>
    <td >componentWillReceiveProps</td>
    <td></td>
    <td></td>
  </tr>
  <tr>
  <tr>
    <td >shouldComponentUpdate</td>
    <td></td>
    <td></td>
  </tr>
  <tr>
    <td >componentWillUpdate</td>
    <td></td>
    <td></td>
  </tr>
  <tr>
    <td >componentDidUpdate</td>
    <td></td>
    <td></td>
  </tr>
  <tr>
    <td >componentWillUnmount</td>
    <td></td>
    <td></td>
  </tr>
  <tr>
    <td >componentDidCatch</td>
    <td></td>
    <td></td>
  </tr>
</table>
