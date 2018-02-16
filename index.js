#!/usr/bin/env node
'use strict';

const ArgumentParser = require('argparse').ArgumentParser;
const fs = require('fs');
const os = require('os');
const path = require('path');

function _readData(filename) {
    let rawData = fs.readFileSync(filename);
    if (rawData.length < 2) {
        rawData = '[]';
    }
    return JSON.parse(rawData);
}

function _updateFile(filename, data) {
    fs.writeFileSync(filename, JSON.stringify(data));
}

function doPeek(data) {
    if (data.length > 0) {
        console.log('     Next:', data[data.length - 1]);
    } else {
        console.log('Your stack is empty.');
    }
}

function doPop(filename, data) {
    if (data.length > 0) {
        console.log('Completed:', data.pop());
        doPeek(data);
        _updateFile(filename, data);
    } else {
        console.log("Nothing to pop");
    }
}

function doPush(filename, data, item) {
    item = item.trim();
    if (item.length > 0) {
        data.push(item);
        doShow(data);
        _updateFile(filename, data);
    } else {
        console.log("Cannot add nothing");
    }
}

function doShow(data) {
    for (let index in data) {
        console.log(data[index]);
    }
}

function init() {
    let parser = new ArgumentParser({
        version: '1.0.0',
        addHelp: true,
        description: 'Argparse example'
    });

    const defaultFilename = path.join(os.homedir(), '.mentalstack', 'default.json');
    parser.addArgument(
        ['--file', '-f',],
        {
            action: 'store',
            defaultValue: defaultFilename,
            dest: 'filename',
            help: 'File to store state to',
            metavar: 'filename',
            required: false,
        }
    );

    const commandList = ['peek', 'pop', 'push', 'show'];
    parser.addArgument(
        'command',
        {
            choices: commandList,
        }
    );
    parser.addArgument(
        'items',
        {
            nargs: '*',
            required: false,
        }
    );

    let args = parser.parseArgs();

    if (args.length < 0) {
        parser.printUsage();
        process.exit();
    }

    // TODO Check and create subdirectory in home if necessary
    let data = _readData(args.filename);

    return {
        data: data,
        args: args
    };
}

function main() {
    let setup = init();
    let data = setup.data;
    let args = setup.args;
    let file = args.filename;
    let command = args.command;

    switch (command) {
        case 'peek':
            doPeek(data);
            break;
        case 'pop':
            doPop(file, data);
            break;
        case 'push':
            let item = args.items.join(' ');
            doPush(file, data, item);
            break;
        case 'show':
            doShow(data);
            break;
    }
}

main();
