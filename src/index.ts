import { config } from 'dotenv'
import { argParse } from './args'
import { pluginParse } from './plugins'
import { Controller } from './midi'

config()
const args = argParse("", [
    {
        name: '--debug',
        alias: '-d',
        options: {
            action: 'store_true',
            help: "Enable debug"
        }
    }
])
const debug = args.debug
process.env.DEBUG = "0"
if (args.debug) process.env.DEBUG = "1"

async function run() {
    const plugins = await pluginParse()
    if (debug) console.log(plugins)

    const controller = new Controller("APC MINI")
}

run()