import Uglify from 'uglify-js';
import globby from 'globby';
import path from 'path';
import {promises as fs} from 'fs';

// Convert comma separated list to key/value object
// e.g. arrows,expression=true => { arrows: true, expression: true }
const commaListToObject = (list = '') => {
	const object = {};

	list.split(',').forEach(item => {
		if (!item) {
			return;
		}

		const [key, value] = item.split('=');

		if (value === null || typeof value === 'undefined') {
			object[key] = true;
			return;
		}

		if (value.startsWith('[') && value.endsWith(']')) {
			object[key] = value.replace(/^\[(.*)]$/g, '$1').split(',');
			return;
		}

		if (value.startsWith('\'') && value.endsWith('\'')) {
			object[key] = value.replace(/^'(.*)'$/g, '$1');
			return;
		}

		if (value === 'true' || value === 'false') {
			object[key] = value === 'true';
			return;
		}

		object[key] = value;
	});

	return object;
};

const getMinifyOptions = options => {
	let mangle = {};
	if (options.mangle !== 'true') {
		mangle = options.mangle === 'false' ? false : commaListToObject(options.mangle);
	}

	if (mangle && options.mangleProps) {
		mangle = {
			...(typeof mangle === 'object' ? mangle : {}),
			properties: commaListToObject(options.mangleProps)
		};
	}

	return {
		annotations: options.annotations,
		compress: options.compress === 'false' ? false : commaListToObject(options.compress),
		ie8: options.ie,
		// eslint-disable-next-line camelcase
		keep_fnames: options.keepFnames,
		mangle,
		output: commaListToObject(options.outputOptions),
		parse: commaListToObject(options.parse),
		sourceMap: options.sourceMap ? commaListToObject(options.sourceMap) : undefined,
		toplevel: options.toplevel,
		v8: options.v8,
		warnings: options.verbose ? 'verbose' : options.warn,
		webkit: options.webkit
	};
};

export default async function minify(filepaths, options) {
	const fileList = (await globby(filepaths)).filter(fileName => {
		return !fileName.endsWith('.min.js') &&
			!fileName.endsWith(`${options.suffix}.js`) &&
			!fileName.endsWith('.map');
	});

	if (fileList.length === 0) {
		console.warn('No files to minify');
		return;
	}

	const minifyOptions = getMinifyOptions(options);
	const {output, suffix} = options;

	if (output !== 'false' && output !== 'true') {
		await fs.mkdir(output, {recursive: true});
	}

	const promises = fileList.map(async filepath => {
		const sourceCode = await fs.readFile(filepath, 'utf8');
		const result = Uglify.minify(sourceCode, minifyOptions);

		if (result.error) {
			console.error(result.error);
			return Promise.reject(new Error(`could not minify ${filepath}`));
		}

		if (output === 'false') {
			console.log(result.code);
			console.log(result.map);
			return;
		}

		const fileName = path.parse(filepath).name;
		const extension = `${suffix}.js`;
		const outputPath = output === 'true' ? filepath.replace('.js', extension) : path.resolve(output, fileName + extension);
		const filePromises = [];

		filePromises.push(fs.writeFile(outputPath, result.code));

		if (result.map) {
			filePromises.push(fs.writeFile(`${outputPath}.map`, result.map));
		}

		return Promise.all(filePromises);
	});

	await Promise.all(promises);
	console.log(`${fileList.length} file(s) successfully minified`);
}
