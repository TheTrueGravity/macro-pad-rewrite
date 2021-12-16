import { config } from 'dotenv'
import { argParse } from './args'
import { pluginParse } from './plugins'

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
process.env.DEBUG = "0"
if (args.debug) process.env.DEBUG = "1"

console.log(process.env.PLUGIN_FOLDER)

async function run() {
    const plugins = await pluginParse()
    console.log(plugins)
}

run()