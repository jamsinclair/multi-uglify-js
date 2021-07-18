#!/usr/bin/env node
import meow from 'meow';
import minify from './lib/minify.js';

const cli = meow(`
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
	  $ multi-uglifyjs assets/*.js -o dist
`, {
	importMeta: import.meta,
	flags: {
		annotations: {
			type: 'boolean'
		},
		compress: {
			type: 'string',
			alias: 'c'
		},
		ie: {
			type: 'boolean',
			default: false
		},
		keepFnames: {
			type: 'boolean',
			default: false
		},
		mangle: {
			type: 'string',
			alias: 'm',
			default: 'true'
		},
		mangleProps: {
			type: 'string'
		},
		output: {
			type: 'string',
			alias: 'o',
			default: 'true'
		},
		outputOptions: {
			type: 'string',
			alias: 'O'
		},
		parse: {
			type: 'string',
			alias: 'p'
		},
		sourceMap: {
			type: 'string'
		},
		suffix: {
			type: 'string',
			default: '.min'
		},
		toplevel: {
			type: 'boolean',
			default: false
		},
		verbose: {
			type: 'boolean',
			default: false
		},
		warn: {
			type: 'boolean',
			default: false
		},
		webkit: {
			type: 'boolean',
			default: false
		},
		v8: {
			type: 'boolean',
			default: false
		}
	}
});

minify(cli.input, cli.flags);
