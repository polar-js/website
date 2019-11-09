const webpack = require('webpack');
const path = require('path');

const mode = process.argv[2] || 'watch';
if (mode !== 'prod' && mode !== 'watch') throw new Error('Invalid mode, please choose prod or watch');

const compiler = webpack({
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, 'public'),
        filename: 'bundle.js'
    },
    mode: mode === 'watch' ? 'development' : 'production',
});

function handleCompile(err, stats) {
    if (err)
        console.log('\x1b[31m', `Webpack error, something catastrophic happened\n${err}`);
    else if (stats.hasErrors() || stats.hasWarnings()) {
        console.log('\x1b[33m', `Webpack compiled with ${stats.hasErrors() ? 'some' : 'no'} errors and ${stats.hasWarnings() ? 'some' : 'no'} warnings.`);
        console.log('\x1b[0m', stats.toString());
    } else 
        console.log('\x1b[32m', 'Webpack compiled successfully');
}

if (mode === 'watch') compiler.watch({}, handleCompile);
else compiler.run(handleCompile);