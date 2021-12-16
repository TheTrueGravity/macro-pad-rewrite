import { readdirSync, readFileSync } from 'fs'
import { exec } from 'child_process'
import * as path from 'path'

export interface config {
    name: string
    type: number
    requires: string[]
}

async function formatJson(json: object) {
    
}
async function formatPlg(json: object) {
    
}

export async function pluginParse() {
    const debug = process.env.DEBUG == "0" ? false : true

    const plugins: any = {} 

    const pluginFolder = process.env.PLUGIN_FOLDER
    if(!pluginFolder) throw new Error("No plugin folder specified!")
    const _plugins = readdirSync(pluginFolder)

    for (const plugin of _plugins) {
        if (debug) console.log(`Loading plugin ${plugin}`)
        
        const config: config = require(pluginFolder + '/' + plugin + "/config.json")
        
        if (debug) console.log(`Installing dependecies for ${plugin}!`)
        const { stdout, stderr } = await exec(`npm i ${config.requires.toString().replace(/,/g, ' ')}`)
        if (debug) console.log("Done!")
        
        plugins[plugin] = {}
        plugins[plugin]['config'] = config

        if (config.type == 1) {
            plugins[plugin]['plugin'] = require(path.join(pluginFolder, plugin, 'index.js'))
        } else if (config.type == 2) {
            plugins[plugin]['plugin'] = await formatJson(require(path.join(pluginFolder, plugin, 'index.json')))
        } else if (config.type == 3) {
            plugins[plugin]['plugin'] = await formatPlg(readFileSync(path.join(pluginFolder, plugin, 'index.plg')))
        } else throw new Error(`Plugin type of ${config.type} is invalid!`)

        plugins[plugin]['plugin'].init()
    }

    return plugins
}