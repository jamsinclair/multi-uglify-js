# multi-uglify-js

> Batch minify multiple JavaScript files on the command line

This is a very loose wrapper around [UglifyJS 3](https://github.com/mishoo/UglifyJS)

It aims to replicate as much of the UglifyJS command line behaviour within reason.

*⚠️ There may be some bugs around advanced usage of uglify options. Please open an issue or PR if encountered*

## Install

```
$ npm install --global multi-uglify-js
```

## Usage

```
$ multi-uglifyjs --help

Usage
  $ multi-uglifyjs [file globs]

  Options
    --help                      Print usage information.
    --version                   Print version of multi-uglifyjs lib.

    -p, --parse <options>       Specify parse options:
                                https://github.com/mishoo/UglifyJS#parse-options

    -c, --compress [options]    Enable compressor/specify compressor options.
                                Options are comma separated and in the form of: "toplevel,sequences=false"
                                (The former value is defaulting "toplevel" to a true value.)
                                https://github.com/mishoo/UglifyJS#compress-options

    -m, --mangle [options]    	Mangle names/specify mangler options.
                                Options are comma separated and in the form of: "eval,reserved=['$','require','exports']"
                                (The former value is defaulting "eval" to a true value.)
                                https://github.com/mishoo/UglifyJS#mangle-options

    --mangle-props [options]    Mangle properties/specify mangler options.
                                Options are comma separated and in the form of: "builtins,reserved=['doNotChange']"
                                https://github.com/mishoo/UglifyJS#mangle-properties-options

    -O, --output-opts [options] Specify output options

    -o, --output <directory>    Output file directory

    --annotations               Process and preserve comment annotations.
                                (/*@__PURE__*/ or /*#__PURE__*/)

    --ie                        Support non-standard Internet Explorer.
                                Equivalent to setting 'ie: true' in 'minify()'
                                for 'compress', 'mangle' and 'output' options.
                                By default UglifyJS will not try to be IE-proof.

    --keep-fnames               Do not mangle/drop function names.  Useful for
                                code relying on Function.prototype.name.

    --source-map [options]      Enable source map/specify source map options
                                https://github.com/mishoo/UglifyJS#source-map-options

    --toplevel                  Compress and/or mangle variables in top level scope.

    --v8                        Support non-standard Chrome & Node.js
                                Equivalent to setting 'v8: true' in 'minify()'
                                for 'mangle' and 'output' options.
                                By default UglifyJS will not try to be v8-proof.

    --verbose                   Print diagnostic messages.

    --warn                      Print warning messages.

    --webkit                    Support non-standard Safari/Webkit.
                                Equivalent to setting 'webkit: true' in 'minify()'
                                for 'mangle' and 'output' options.
                                By default UglifyJS will not try to be Safari-proof.

  Examples
    # Minify all JavaScript files in the assets directory
    # and output minified files in place
    $ multi-uglifyjs assets/*.js

    # Minify all JavaScript files in the assets directory
    # and output minified files in the dist
    $ multi-uglifyjs assets/*.js -o dists

    # Minify with a different file suffix "-min", becoming "-min.js"
    $ multi-uglifyjs assets/*.js --suffix=-min
```
