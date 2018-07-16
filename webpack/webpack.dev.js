const NamedModulesPlugin = require('webpack/lib/NamedModulesPlugin');

const config = require('./webpack.config');

config.output.publicPath = 'http://localhost:9000/';
config.devtool = '#eval'; // 调试版要开启sourcemap
config.plugins.shift(); // 调试版不需要清空dist文件夹

// 开启文件监听
config.watch = true;
config.watchOptions = {
    ignored: /node_modules/,
    aggregateTimeout: 300,
    poll: 10
};
// 开启显示id和名称的对应关系
config.plugins.push(new NamedModulesPlugin());

config.devServer = {
    inline: true,
    compress: true,
    hot: true,
    proxy: {
        "/brand": {
            target: 'http://mock.brand.jd.com/',
            secure: true,
            changeOrigin: true
        }
    },
    stats: {
        chunks: false,
        children: false,
        colors: true
    },
    historyApiFallback: true,
    port: 3081,
    open: true,
    openPage: 'views/pra/pLearn.html'
};

module.exports = config;
