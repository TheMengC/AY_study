// const WebpackParallelUglifyPlugin = require('webpack-parallel-uglify-plugin');
// let sassExtract = new ExtractTextPlugin('sass.css');
// eslint-disable-next-line import/no-commonjs
const  path = require('path');


const config = {
    resolve: {
        extensions: ['*', '.js', '.jsx'],
        alias: {
            // mobile
            components: path.join(__dirname, 'src_mobile/components'),
            pages: path.join(__dirname, 'src_mobile/pages'),
            '@/constants': path.resolve(__dirname, 'src_mobile/constants'),
            assets: path.resolve(__dirname, 'src_mobile/assets'),

            // pc

            pcComponents: path.join(__dirname, 'src_pc/components'),
            pcPages: path.join(__dirname, 'src_pc/pages'),
            '@/constants': path.resolve(__dirname, 'src_pc/constants'),
            pcAssets: path.resolve(__dirname, 'src_pc/assets'),
            pcStyle: path.resolve(__dirname, 'src_pc/style'),

            tradePublic:path.join(__dirname, 'public/tradePublic'),
            tradePolyfills:path.join(__dirname, 'public/tradePolyfills'),
            mapp_common:path.join(__dirname, 'public/mapp_common'),
        },
    },
};

module.exports = config;
