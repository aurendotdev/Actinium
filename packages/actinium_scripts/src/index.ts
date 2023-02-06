#!/home/gitpod/.nvm/versions/node/v16.19.0/bin/node

import create from './command/create'
import build from './command/build'
import dev from './command/dev'
import start from './command/start'


let useArgs = () => {
    let v = process.argv
    let c = process.argv.length
    return {argv: v, argc: c}
}


async function Main() {

    let {argv, argc} = useArgs()

    if (argc < 3) {
        await create()
        return
    }

    switch (argv[2]) {
        case "build":
            await build()
            break;
        case "dev": 
            await dev(true)
            break;
        case "start":
            await start(true)
            break

        default:
            break;
    }

}

Main().catch((e) => {
    console.error(e)
})