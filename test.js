import test from 'ava';
import execa from 'execa';
import globby from 'globby';
import fs from 'fs';
import {promisify} from 'util';

const fsRm = promisify(fs.unlink);
const fsRmdir = promisify(fs.rmdir);

const cleanFiles = async (globs = []) => {
	const files = await globby(globs);
	return Promise.all(files.map(file => fsRm(file)));
};

test.after(async () => {
	await cleanFiles(['fixtures/*.min.js']);
	await fsRmdir('dist', {recursive: true});
	await fsRmdir('dist-multiple', {recursive: true});
});

test('minifies multiple js files individually with default params and outputs in place', async t => {
	await cleanFiles('fixtures/*.min.js');
	const {stdout} = await execa('./cli.js', ['fixtures/math-*.js']);
	t.is(stdout, '2 file(s) successfully minified');
	const minifiedFiles = await globby('fixtures/*.min.js');
	t.deepEqual(minifiedFiles, ['fixtures/math-add.min.js', 'fixtures/math-subtract.min.js']);
});

test('minifies multiple js files individually and outputs to specified dist directory', async t => {
	await cleanFiles('dist');
	const {stdout} = await execa('./cli.js', ['fixtures/math-*.js', '-o', 'dist']);
	t.is(stdout, '2 file(s) successfully minified');
	const minifiedFiles = await globby(['dist']);
	t.deepEqual(minifiedFiles, ['dist/math-add.min.js', 'dist/math-subtract.min.js']);
});

test('minifies multiple js files with custom minification suffix', async t => {
	await cleanFiles('dist-multiple');
	const {stdout} = await execa('./cli.js', ['fixtures/math-*.js', '-o', 'dist-multiple', '--suffix=-minified']);
	t.is(stdout, '2 file(s) successfully minified');
	const minifiedFiles = await globby(['dist-multiple/*-minified.js']);
	t.deepEqual(minifiedFiles, ['dist-multiple/math-add-minified.js', 'dist-multiple/math-subtract-minified.js']);
});
