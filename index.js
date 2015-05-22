#!/usr/bin/env node
'use strict';

var fs        = require('fs');
var crypto    = require('crypto');
var _         = require('lodash');
var argv      = require('minimist')(process.argv.slice(2));
var FILENAME  = 'repo.vault';
var ALGORITHM = 'aes-256-ctr';
var HEADER    = '##### To get tool to decrypt it run "npm install -g repovault" (Node.js) #####';

// FS Functions
function read_repo_vault() {
    var repovault_file;
    try {
        repovault_file = fs.readFileSync(FILENAME, 'utf-8');
    } catch (e) {
        return [];
    }

    var splitfile = repovault_file.split('\n');
    var values    = [];

    splitfile.forEach(function (value, key) {
        if (!value) { return; }
        if (value.indexOf('#') === 0) {
            return;
        }

        values.push(value);
    });

    return values;
}

function write_repo_vault() {
    fs.writeFileSync(FILENAME, HEADER + '\n' + repovault.join('\n'));
}

// Repovault
var repovault = read_repo_vault();

function encrypt() {
    var content = JSON.stringify({'content': context.content});
    var cipher  = crypto.createCipher(ALGORITHM, context.password);
    var crypted = cipher.update(content, 'utf8', 'hex');
    crypted    += cipher.final('hex');

    repovault.push(crypted);
    write_repo_vault();
}

function decrypt() {
    repovault.forEach(function (value) {
        var decipher = crypto.createDecipher(ALGORITHM, context.password);
        var data;
        try {
            data   = decipher.update(value, 'hex', 'utf8');
            data  += decipher.final('utf8');
            data   = JSON.parse(data);
        } catch (e) {
            return;
        }

        if (data) {
            console.info(data.content);
        }
    });
}

function delete_() {
    var delete_itens = [];

    repovault.forEach(function (value) {
        var decipher = crypto.createDecipher(ALGORITHM, context.password);
        var data;
        try {
            data   = decipher.update(value, 'hex', 'utf8');
            data  += decipher.final('utf8');
            data   = JSON.parse(data);
        } catch (e) {
            return;
        }

        if (!data) { return; }

        delete_itens.push(value);
    });

    delete_itens.forEach(function (value) {
        _.pull(repovault, value);
    });

    fs.writeFileSync(FILENAME, HEADER + '\n' + repovault.join('\n'));
}

// CLI
var context   = {
    "password": argv._[0],
    "content" : argv._.slice(1).join(' '),
    "delete"  : argv.delete || argv.d || argv.D
};

if (context.delete) {
    delete_();
} else if (context.password && !context.content) {
    decrypt(context.password);
} else if (context.password && context.content) {
    encrypt(context.password, context.content);
} else {
    console.log(fs.readFileSync(__dirname + '/help.md', 'utf-8').trim());
}
