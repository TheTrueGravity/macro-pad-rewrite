"use strict";
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
const dotenv_1 = require("dotenv");
const args_1 = require("./args");
const plugins_1 = require("./plugins");
dotenv_1.config();
const args = args_1.argParse("", [
    {
        name: '--debug',
        alias: '-d',
        options: {
            action: 'store_true',
            help: "Enable debug"
        }
    }
]);
const debug = args.debug;
process.env.DEBUG = "0";
if (args.debug)
    process.env.DEBUG = "1";
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        const plugins = yield plugins_1.pluginParse();
        if (debug)
            console.log(plugins);
        plugins["example 3"].plugin.test();
    });
}
run();
