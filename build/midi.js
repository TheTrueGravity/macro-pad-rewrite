"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Output = exports.Input = void 0;
const { input, output } = require('midi');
class Input extends input {
    constructor(port, autoConnect = true) {
        super();
        this.port = port;
        this._portCount = this.getPortCount();
        if (autoConnect)
            this.connect();
    }
    get portCount() {
        return this._portCount;
    }
    getPortNames() {
        const out = [];
        const reversed = {};
        for (var i = 0; i < this.portCount; i++) {
            out.push(this.getPortName(i));
            reversed[this.getPortName(i)] = i;
        }
        out.push(reversed);
        return out;
    }
    connect() {
        try {
            if (this.port == undefined)
                return;
            else if (typeof this.port == 'number') {
                this.openPort(this.port);
            }
            else if (typeof this.port == 'string') {
                const portNames = this.getPortNames();
                const reversedPortNames = portNames.pop();
                if (reversedPortNames == undefined)
                    return;
                if (reversedPortNames[this.port] != undefined) {
                    this.openPort(reversedPortNames[this.port]);
                }
            }
        }
        catch (error) {
            throw error;
        }
    }
}
exports.Input = Input;
class Output extends output {
    constructor(port, autoConnect = true) {
        super();
        this.port = port;
        this._portCount = this.getPortCount();
        if (autoConnect)
            this.connect();
    }
    get portCount() {
        return this._portCount;
    }
    getPortNames() {
        const out = [];
        const reversed = {};
        for (var i = 0; i < this.portCount; i++) {
            out.push(this.getPortName(i));
            reversed[this.getPortName(i)] = i;
        }
        out.push(reversed);
        return out;
    }
    connect() {
        try {
            if (this.port == undefined)
                return;
            else if (typeof this.port == 'number') {
                this.openPort(this.port);
            }
            else if (typeof this.port == 'string') {
                const portNames = this.getPortNames();
                const reversedPortNames = portNames.pop();
                if (reversedPortNames == undefined)
                    return;
                if (reversedPortNames[this.port] != undefined) {
                    this.openPort(reversedPortNames[this.port]);
                }
            }
        }
        catch (error) {
            throw error;
        }
    }
}
exports.Output = Output;
