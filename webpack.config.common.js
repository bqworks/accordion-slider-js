import path, { dirname } from 'path';
import { unlink } from 'fs';
import { fileURLToPath } from 'url';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';
import ESLintPlugin from 'eslint-webpack-plugin';
import StylelintPlugin from 'stylelint-webpack-plugin';

const JS_COMMON_CONFIG = {
    entry:  './entry/bundle.js',
    output: {
        path: path.resolve( fileURLToPath( dirname( import.meta.url ) ), 'build' ),
        filename: 'accordion-slider.js'
    },
    plugins: [
        new ESLintPlugin()
    ]
};

const CSS_COMMON_CONFIG = {
    entry: './entry/style-bundle.js',
    output: {
        path: path.resolve( fileURLToPath( dirname( import.meta.url ) ), 'build' ),
        filename: 'accordion-slider-css-build.js'
    },
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: [ MiniCssExtractPlugin.loader, 'css-loader' ]
            }
        ]
    },
    optimization: {
        minimizer: [
            new CssMinimizerPlugin()
        ]
    },
    plugins: [
        new StylelintPlugin(),
        new MiniCssExtractPlugin({
            filename: 'accordion-slider.css'
        }),
        {
            apply: ( compiler ) => {
                compiler.hooks.done.tap( 'accordion-slider-js', async () => {
                    await unlink( 'build/accordion-slider-css-build.js', () => {} );
                });
            }
        }
    ]
};

export { 
    JS_COMMON_CONFIG, 
    CSS_COMMON_CONFIG
};
