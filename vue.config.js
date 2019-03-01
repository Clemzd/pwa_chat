module.exports = {
    devServer: {
        proxy: {
            // proxy all requests starting with /api to jsonplaceholder
            '/ws': {
                target: 'https://localhost/ws',
                changeOrigin: true,
                pathRewrite: {
                    '^/ws': ''
                }
            }
        }
    }
}