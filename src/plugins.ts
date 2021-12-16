import { readdirSync, readFileSync } from 'fs'
import { exec } from 'child_process'
import * as path from 'path'

export interface config {
    name: string
    type: number
    requires: string[]
}

async function isIndent(set: string[]) {
    if (set[0] != '') return false
    if (set[1] != '') return false
    if (set[2] != '') return false
    if (set[3] != '') return false
    return true
}

async function formatJson(json: any) {
    const out: any = {}
    for (const element in json) {
        const elements: any[] = []
        if (json[element].type == "func") {
            for (const exec of json[element].exec) {
                if (exec.type == "print") { elements.push([console.log, exec.data]) }
            }
            out[element] = function() {
                for (const element of elements) {
                    element[0](element[1])
                }
            }
        }
    }

    return out
}
async function formatPlg(plg: string) {
    const out: any = {}
    plg = plg.replace(/\r/g, '')

    const lines = plg.split('\n')
    const push: any[] = []

    for (var i = 0; i < lines.length; i++) {
        const elements: any[] = []
        var words = lines[i].split(" ")

        if (words.shift() == 'func') {
            elements[0] = words.shift()
            while(true) {
                i++
                if (!lines[i]) break
                words = lines[i].split(" ")
                
                if (await isIndent(words.slice(0, 4))) {
                    words = words.slice(4)
                    if (words.shift() == 'print') {
                        const print = words.join(" ")
                        elements.push([console.log, print])
                    }
                } else { i--; break }
            }
            out[elements.shift()] = function() {
                for (const element of elements) {
                    element[0](element[1])
                }
            }
        }
    }

    return out
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
            plugins[plugin]['plugin'] = await formatPlg(readFileSync(path.join(pluginFolder, plugin, 'index.plg')).toString('utf-8'))
        } else throw new Error(`Plugin type of ${config.type} is invalid!`)

        plugins[plugin]['plugin'].init()
    }

    return plugins
}