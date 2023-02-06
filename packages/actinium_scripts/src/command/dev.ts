import { cwd } from 'process'
import { OutputOptions, rollup, RollupOptions } from 'rollup'
import esbuild from 'rollup-plugin-esbuild'
import fs from 'fs'
import serve, { RollupServeOptions } from 'rollup-plugin-serve'
import livereload from 'rollup-plugin-livereload'

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
        }
        )],
    watch: {
        clearScreen: false
    }
}

export default async function Dev(dev_mode: boolean) {
    if (dev_mode) {
        input_opts.plugins = [
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
            // serve({
            //     verbose: true,
            //     contentBase: 'src6',
            //     host: 'localhost',
            //     port: 9910,
            //     mimeTypes: {
            //         'application/javascript': ['js_commonjs-proxy']
            //     },
            //     onListening: function (server) {
            //         const address: any = server.address()
            //         if (address === null) return;
            //         const host = address.address === '::' ? 'localhost' : address.address
            //         // by using a bound function, we can access options as `this`
            //         const protocol = (this as RollupServeOptions).https ? 'https' : 'http'
            //         console.log(`Server listening at ${protocol}://${host}:${address.port}/`)
            //     }
            // }),
        ]
    }
    let bundle = await rollup(input_opts)
    await bundle.write(output_opts)
}