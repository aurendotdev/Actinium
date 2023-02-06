import { cwd } from 'process'
import { OutputOptions, rollup, RollupOptions } from 'rollup'
import esbuild from 'rollup-plugin-esbuild'
import fs from 'fs'
import commonjs from '@rollup/plugin-commonjs'
import nodeResolve from '@rollup/plugin-node-resolve'

let input: string = ""


if (fs.existsSync(`${cwd()}/src/index.js`)) {
    input = `${cwd()}/src/index.js`
}

if (fs.existsSync(`${cwd()}/src/index.ts`)) {
    input = `${cwd()}/src/index.ts`
}


let output_opts: OutputOptions = {
    dir: 'build',
    format: 'iife'
}

let input_opts: RollupOptions = {
    input: input,
    plugins: [
        esbuild({
            include: /\.[jt]sx?$/, // default, inferred from `loaders` option
            exclude: /node_modules/, // default
            sourceMap: true, // default
            minify: process.env.NODE_ENV === 'production',
            target: 'es2017',
            jsx: 'transform',
            jsxFactory: 'Actinium.createElement',
            jsxFragment: 'Actinium.Fragment',
            define: {
                __VERSION__: '"x.y.z"',
            },
            tsconfig: 'tsconfig.json',
            loaders: {
                '.json': 'json',
                '.js': 'jsx',
                '.tsx': 'tsx'
            },
        }),
        commonjs(),
        nodeResolve()
    ],
}

export default async function Build() {
    let bundle = await rollup(input_opts)
    await bundle.write(output_opts)
}