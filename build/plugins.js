"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pluginParse = void 0;
const fs_1 = require("fs");
const child_process_1 = require("child_process");
const path = __importStar(require("path"));
function isIndent(set) {
    return __awaiter(this, void 0, void 0, function* () {
        if (set[0] != '')
            return false;
        if (set[1] != '')
            return false;
        if (set[2] != '')
            return false;
        if (set[3] != '')
            return false;
        return true;
    });
}
function formatJson(json) {
    return __awaiter(this, void 0, void 0, function* () {
        const out = {};
        for (const element in json) {
            const elements = [];
            if (json[element].type == "func") {
                for (const exec of json[element].exec) {
                    if (exec.type == "print") {
                        elements.push([console.log, exec.data]);
                    }
                }
                out[element] = function () {
                    for (const element of elements) {
                        element[0](element[1]);
                    }
                };
            }
        }
        return out;
    });
}
function formatPlg(plg) {
    return __awaiter(this, void 0, void 0, function* () {
        const out = {};
        plg = plg.replace(/\r/g, '');
        const lines = plg.split('\n');
        const push = [];
        for (var i = 0; i < lines.length; i++) {
            const elements = [];
            var words = lines[i].split(" ");
            if (words.shift() == 'func') {
                elements[0] = words.shift();
                while (true) {
                    i++;
                    if (!lines[i])
                        break;
                    words = lines[i].split(" ");
                    if (yield isIndent(words.slice(0, 4))) {
                        words = words.slice(4);
                        if (words.shift() == 'print') {
                            const print = words.join(" ");
                            elements.push([console.log, print]);
                        }
                    }
                    else {
                        i--;
                        break;
                    }
                }
                out[elements.shift()] = function () {
                    for (const element of elements) {
                        element[0](element[1]);
                    }
                };
            }
        }
        return out;
    });
}
function pluginParse() {
    return __awaiter(this, void 0, void 0, function* () {
        const debug = process.env.DEBUG == "0" ? false : true;
        const plugins = {};
        const pluginFolder = process.env.PLUGIN_FOLDER;
        if (!pluginFolder)
            throw new Error("No plugin folder specified!");
        const _plugins = fs_1.readdirSync(pluginFolder);
        for (const plugin of _plugins) {
            if (debug)
                console.log(`Loading plugin ${plugin}`);
            const config = require(pluginFolder + '/' + plugin + "/config.json");
            if (debug)
                console.log(`Installing dependecies for ${plugin}!`);
            const { stdout, stderr } = yield child_process_1.exec(`npm i ${config.requires.toString().replace(/,/g, ' ')}`);
            if (debug)
                console.log("Done!");
            plugins[plugin] = {};
            plugins[plugin]['config'] = config;
            if (config.type == 1) {
                plugins[plugin]['plugin'] = require(path.join(pluginFolder, plugin, 'index.js'));
            }
            else if (config.type == 2) {
                plugins[plugin]['plugin'] = yield formatJson(require(path.join(pluginFolder, plugin, 'index.json')));
            }
            else if (config.type == 3) {
                plugins[plugin]['plugin'] = yield formatPlg(fs_1.readFileSync(path.join(pluginFolder, plugin, 'index.plg')).toString('utf-8'));
            }
            else
                throw new Error(`Plugin type of ${config.type} is invalid!`);
            plugins[plugin]['plugin'].init();
        }
        return plugins;
    });
}
exports.pluginParse = pluginParse;
