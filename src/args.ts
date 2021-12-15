const {
    ArgumentParser
} = require('argparse')

export function argParse (description: string, args: any[]) {
    const parser = new ArgumentParser({
        description: description
    })

    parser.add_argument('-v', '--version', {
        action: 'version',
        version: process.env.VERSION
    })

    args.forEach(arg => {
        parser.add_argument(arg.name, arg.alias, arg.options)
    })

    const _arguments = parser.parse_args()

    return _arguments
}