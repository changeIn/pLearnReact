# 练习二 List & Keys

熟悉React列表中Key的作用，研究其特点

* key可否省略？
  可以省略，但会在控制台中出警告:warning.js:33 Warning: Each child in an array or iterator should have a unique "key" prop.

* key可否从props中读取到？
  key会作为给React的提示，但不会传递给子组件。所以子组件中不能读出props.key

* 可否设计一个列表程序，表明key在虚拟树diff中的作用？
  Keys可以在DOM中的某些元素被增加或删除的时候帮助React识别哪些元素发生了变化。
  不建议使用索引来进行排序，因为这会导致渲染变得很慢

> 需阅读React官方文档：[列表 & Keys](https://doc.react-china.org/docs/lists-and-keys.html)，[协调（Reconciliation）](https://doc.react-china.org/docs/reconciliation.html)
