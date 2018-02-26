const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const wpConfigUtils = require('webpack-config-utils');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const path = require("path");

module.exports = config => {
    const ifUtils = wpConfigUtils.getIfUtils(config.env);
    const wpPlugins = [], rules = [];
    let aliases = {};

    //Only for production build
    if (ifUtils.ifProd()) {
        //Uglify + tree-shaking
        wpPlugins.push(new UglifyJsPlugin({
            sourceMap: true
        }));
        //Raw copy of all assets
        wpPlugins.push(new CopyWebpackPlugin([
            {from: './assets', to: 'assets'}
        ]));
        //import of all css dependencies
        rules.push({
            test: /\.(png|jpe?g|gif|svg|woff|woff2|ttf|eot|ico|otf)$/,
            use: [
                {
                    loader: "file-loader",
                    options: {
                        name: "[name].[hash].[ext]",
                        outputPath: "assets/css-imports/",
                    }
                }
            ]
        });
    } else {
        //Only local build
        //Load all css dependencies into css file
        rules.push(
            {
                test: /\.(png|jpe?g|gif|svg|woff|woff2|ttf|eot|ico|otf)$/,
                loader: 'url-loader?name=assets/[name].[ext]'
            }
        );
        //Hack for using npm link with ngx components :
        //force typescript to use root dependencies instead of linked component dependencies
        const appPackageContent = require(`${config.app}/../package.json`);
        const APP_NODE_MODULES_PATH = path.resolve(config.app + '/../node_modules');
        Object.keys(appPackageContent.dependencies)
            .forEach((dependency) => {
                aliases[dependency] = `${APP_NODE_MODULES_PATH}/${dependency}`;
            });
    }
    return {
        devtool: ifUtils.ifProd('source-map', 'cheap-module-eval-source-map'),
        devServer: {
            contentBase: config.app,
            clientLogLevel: "info",
            watchOptions: {
                ignored: "**/node_modules/**/*.*"
            }
        },
        target: 'web',
        //Base path for all relative paths
        context: config.app,
        output: {
            path: config.dist,
            filename: ifUtils.ifProd('[name].[chunkhash].js', '[name].js'),
            sourceMapFilename: ifUtils.ifProd('[name].[chunkhash].map', '[name].map')
        },

        entry: {
            ngx: "./ngx/imports"
        },

        resolve: {
            extensions: ['.ts', '.js'],
            symlinks: false,
            alias: aliases
        },
        externals: {},
        module: {
            rules: rules.concat([
                {
                    test: /\.js$|\.ts$/,
                    use: ['source-map-loader'],
                    enforce: "pre"
                },
                {
                    test: /\.ts$/,
                    loaders: [
                        {
                            loader: 'awesome-typescript-loader',
                            options: {configFileName: 'tsconfig.json'}
                        },
                        'angular2-template-loader'
                    ]
                },
                {
                    test: /\.html$/,
                    exclude: filePath => {
                        //Manage ng1 templates
                        if (ifUtils.ifNotProd()) {
                            //No ng1 template bundle in localhost
                            return true;
                        }
                        //All ng1 html (but not ngx and index.html)
                        return filePath.includes("ngx") || filePath.includes("index.html");
                    },
                    use: [
                        'ngtemplate-loader?module=hybrid-helper-html-templates&relativeTo=' + config.app + '/',
                        'html-loader'
                    ]
                },
                {
                    test: filePath => {
                        const isHtml = filePath.endsWith(".html");
                        if (!isHtml) {
                            return false;
                        }
                        if (ifUtils.ifNotProd()) {
                            //In localhost do it for all html
                            return true;
                        }
                        //Only index.html and ngx
                        return filePath.includes("ngx") || filePath.includes("index.html");
                    },
                    loader: 'html-loader'
                },
                {
                    test: /\.js$/,
                    include: config.app,
                    use: ['script-loader']
                },
                {
                    test: /\.css$/,
                    use: [
                        'style-loader',
                        'css-loader' + ifUtils.ifNotProd('?sourceMap', '')
                    ]
                }
            ])
        },

        plugins: wpPlugins.concat([
            //To remove some browers console warnings
            //https://github.com/angular/angular/issues/14898
            new webpack.ContextReplacementPlugin(
                // The (\\|\/) piece accounts for path separators in *nix and Windows
                /angular(\\|\/)core(\\|\/)(@angular|esm5)/,
                config.app
            ),
            new webpack.LoaderOptionsPlugin({
                //To generate .map files
                debug: true
            }),
            new HtmlWebpackPlugin({
                inject: true,
                template: './index.html',
                chunksSortMode: 'manual',
                //files are injected in this order
                chunks: ['ngx']
            })
        ])
    };
};
