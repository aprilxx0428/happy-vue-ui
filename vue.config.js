const CompressionWebpackPlugin = require('compression-webpack-plugin')
const IS_PROD = process.env.NODE_ENV === 'production'
// const IS_PROD = false
const productionGzipExtensions = ['js', 'css', 'ts']
const publicPath = process.env.VUE_APP_PUBLICPATH
const title = process.env.VUE_APP_TITLE
module.exports = {
    pages: {
        index: {
            // page 的入口
            entry: 'src/main.ts',
            // 模板来源
            template: 'public/index.html',
            // 在 dist/index.html 的输出
            filename: 'index.html',
            title: title
        }
    },
    publicPath: publicPath,
    productionSourceMap: false,
    transpileDependencies: ['nanoid'],
    devServer: {
        open: true,
        port: 8008,
        https: false,
        proxy: {
            '/unpcApi/*': {
                target: 'http://localhost:1203/unpc/',
                pathRewrite: {
                    '^/unpcApi': ''
                },
                changeOrigin: true,
                secure: false
            }
        }
    },
    configureWebpack: config => {
        if (IS_PROD) {
            config.plugins.push(
                new CompressionWebpackPlugin({
                    test: new RegExp('\\.(' + productionGzipExtensions.join('|') + ')$'),
                    threshold: 10240,
                    minRatio: 0.8
                })
            )

            // const terserPlugin = config.optimization.minimizer[0]
            // terserPlugin.options.terserOptions.compress.warnings = false
            // terserPlugin.options.terserOptions.compress.drop_console = true
            // terserPlugin.options.terserOptions.compress.drop_debugger = true
            // terserPlugin.options.terserOptions.compress.pure_funcs = ['console.log']
        } else {
            config.devtool = 'source-map'
        }
    }
}
