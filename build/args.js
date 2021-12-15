"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.argParse = void 0;
const { ArgumentParser } = require('argparse');
function argParse(description, args) {
    const parser = new ArgumentParser({
        description: description
    });
    parser.add_argument('-v', '--version', {
        action: 'version',
        version: process.env.VERSION
    });
    args.forEach(arg => {
        parser.add_argument(arg.name, arg.alias, arg.options);
    });
    const _arguments = parser.parse_args();
    return _arguments;
}
exports.argParse = argParse;
