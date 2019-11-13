const path = require('path');

module.exports = env => ({
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, 'public'),
        filename: 'bundle.js'
    },
    mode: env.production ? 'production' : 'development',
    watch: env.production ? false : true
});