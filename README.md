# SZInternship

## React学习实践

### 环境配置：

#### 安装开发包

* 首先执行以下命令：

```txt
npm install
```

* 如果网络不好，安装失败，可以执行以下命令安装

```txt
npm install -d --registry https://registry.npm.taobao.org
```

* 如果node-sass安装失败，可执行如下命令安装

```txt
npm install -d --registry https://registry.npm.taobao.org
```

#### 安装必备开发插件

* **vscode版：[ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)**

* **vscode版：[EditorConfig for VS Code](https://marketplace.visualstudio.com/items?itemName=EditorConfig.EditorConfig)**

>如果使用webstorm系开发，则上述两个插件是IDE默认内置，不需要另行安装

### 开发规范：

#### 项目结构规范

* 每个组件单独在一个文件中定义，文件名就是组件名，注意首字母要大写。文件放在component文件夹中。每个文件内只能定义一个组件。

* 配置内容统一放在config文件夹下。

#### js开发规范

遵循ESLint规则即可

#### 代码提交注释规范

* 【xxx(页|模块)】描述：以中文大括号开始，里面只能写某某页或某某模块，大括号后面将修改写清楚。每行只能有一个【xxx(页|模块)】描述,涉及多个页面或模块需要换行，每行写一个，如：

    错误写法：

    ```txt
    【流量分析页】请求表格数据ajax参数问题修复【行业趋势页】按照产品要求隐藏下单指标       × 没有换行
    ```

    正确写法：

    ```txt
    【流量分析页】请求表格数据ajax参数问题修复
    【行业趋势页】按照产品要求隐藏下单指标                                               √
    ```

    ---------
    错误写法：

    ```txt
    【流量分析】请求表格数据ajax参数问题修复                                             × 没有写‘页’或‘模块’
    ```

    正确写法：

    ```txt
    【流量分析页】请求表格数据ajax参数问题修复                                            √
    ```

    ---------
    错误写法：

    ```txt
    【build】                                                                          × build不需要加【】
    ```

    正确写法：

    ```txt
    build                                                                              √
    ```

* ([bB]uild)|([rR]elease)|([mM]erge)：单纯的build、release、merge（合并冲突自动产生的message）不按照【】的形式，而是直接写build、release、merge即可，首字母不区分大小写。