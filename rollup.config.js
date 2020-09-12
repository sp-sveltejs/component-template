import babel from 'rollup-plugin-babel';
import svelte from 'rollup-plugin-svelte';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { terser } from 'rollup-plugin-terser';
import jscc from 'rollup-plugin-jscc';
import pkg from './package.json';
import autoPreprocess from 'svelte-preprocess';
import typescript from '@rollup/plugin-typescript';

const production = !process.env.ROLLUP_WATCH;

const name = pkg.name
	.replace(/^(@\S+\/)?(svelte-)?(\S+)/, '$3')
	.replace(/^\w/, m => m.toUpperCase())
	.replace(/-\w/g, m => m[1].toUpperCase());

export default {
	input: 'src/index.ts',
	output: [

		{ file: pkg.module, 'format': 'es', sourcemap: true, },
		{ file: pkg.main, 'format': 'umd', name, sourcemap: true, }
	],
	plugins: [
		jscc({
			values:{
				_DEV: !production,
				_PNPCONFIG: process.env.pnpconfig,
				_SPVER: process.env.spver ? process.env.spver : 0
			}
		}),
		svelte({
			preprocess: autoPreprocess(),
			extensions: ['.svelte'],
		}),
		typescript({ 
			sourceMap: true 
		}),
		resolve({
			dedupe: ['.svelte']
		}),
		commonjs(),
		babel({
			extensions: [ '.js', '.mjs', '.html', '.svelte', 'es', 'umd' ],
			runtimeHelpers: true,
			exclude: [/node_modules\/(core-js)/ ] ,
			presets: [
				[
					'@babel/preset-env',
					{
						targets: 'IE 11',
						useBuiltIns: 'usage',
						corejs: 3
					}
				]
			],
			plugins: [
			'@babel/plugin-syntax-dynamic-import',
				[
					'@babel/plugin-transform-runtime',
					{
						corejs: 3,
                     
					}
				]
			]
		}),
		production && terser()
	],
	watch: {
		clearScreen: false
	}
};

