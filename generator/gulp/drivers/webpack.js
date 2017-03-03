import path from 'path'
import gulp from 'gulp'
import webpack from 'webpack-stream'
import concat from 'pipe-concat'
import extend from 'extend'

import config from './webpack.config'

/**
@param settings: pass to webpack
@param options: {
    from: entry file absolute path,
    to: output file absolute path,
    boolean sourcemap: whether to create a sourcemap file,
    boolean minify: whether to create a minified file,
}
**/

export default function({from, to, settings  = {}, options = {}}) {
    var outputdir = path.dirname(to)
    var filename = path.basename(to)
    var basename = path.basename(to, '.js')

    settings = config(settings)
    var outputSettings = settings.output

    outputSettings.filename = outputSettings.filename || filename
    outputSettings.library = outputSettings.library || basename

    // sourcemap
    if(options.sourcemap === 'inline') {
        settings.devtool = 'inline-source-map'
    }
    else if(options.sourcemap) {
        settings.devtool = 'source-map'
        outputSettings.sourceMapFilename = outputSettings.sourceMapFilename || filename + '.map'
    }

    var stream1 = gulp.src(from)
        .pipe(webpack(settings))
        .pipe(gulp.dest(outputdir))

    if(!options.minify) {
        return stream1
    }

    // minify
    settings = extend(true, {}, settings)
    outputSettings = settings.output
    filename = outputSettings.filename
    filename = path.basename(filename, '.js') + '.min.js'
    outputSettings.filename = filename
    if(outputSettings.sourceMapFilename) outputSettings.sourceMapFilename = filename + '.map'
    settings.plugins.push(
        new webpack.webpack.optimize.UglifyJsPlugin({
            minimize: true,
        })
    )

    var stream2 = gulp.src(from)
        .pipe(webpack(settings))
        .pipe(gulp.dest(outputdir))

    return concat(stream1, stream2)
}
