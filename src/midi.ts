const {
    input,
    output
} = require('midi')

export class Input extends input {
    private port: string | number
    private _portCount: number
    
    public get portCount(): number {
        return this._portCount
    }  

    constructor (port: string | number, autoConnect: boolean = true) {
        super()
        this.port = port
        this._portCount = this.getPortCount()
        if (autoConnect) this.connect()
    }

    public getPortNames() {
        const out: string[] = []
        const reversed: any = {}
        for (var i = 0; i < this.portCount; i++) {
            out.push(this.getPortName(i))
            reversed[this.getPortName(i)] = i
        }
        out.push(reversed)
        return out
    }

    public connect() {
        try {
            if (this.port == undefined) return
            else if (typeof this.port == 'number') { this.openPort(this.port) }
            else if (typeof this.port == 'string') {
                const portNames = this.getPortNames()
                const reversedPortNames: any = portNames.pop()
                if (reversedPortNames == undefined) return

                if (reversedPortNames[this.port] != undefined) { this.openPort(reversedPortNames[this.port]) }
            }
        } catch (error) { throw error }
    }
}

export class Output extends output {
    private port: string | number
    private _portCount: number
    
    public get portCount(): number {
        return this._portCount
    }  

    constructor (port: string | number, autoConnect: boolean = true) {
        super()
        this.port = port
        this._portCount = this.getPortCount()
        if (autoConnect) this.connect()
    }

    public getPortNames() {
        const out: string[] = []
        const reversed: any = {}
        for (var i = 0; i < this.portCount; i++) {
            out.push(this.getPortName(i))
            reversed[this.getPortName(i)] = i
        }
        out.push(reversed)
        return out
    }

    public connect() {
        try {
            if (this.port == undefined) return
            else if (typeof this.port == 'number') { this.openPort(this.port) }
            else if (typeof this.port == 'string') {
                const portNames = this.getPortNames()
                const reversedPortNames: any = portNames.pop()
                if (reversedPortNames == undefined) return

                if (reversedPortNames[this.port] != undefined) { this.openPort(reversedPortNames[this.port]) }
            }
        } catch (error) { throw error }
    }
}

export interface controllerConfig {
    inputPort: string | number
    outputPort: string | number
}

export class Controller {
    private _input: Input
    private _output: Output

    public get input() {
        return this._input
    }
    public get output() {
        return this._output
    }

    constructor (config: controllerConfig) {
        this._input = new Input(config.inputPort)
        this._output = new Output(config.inputPort)
    }
}