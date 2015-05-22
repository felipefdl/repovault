#!/usr/bin/env node
'use strict';

var fs        = require('fs');
var crypto    = require('crypto');
var FILENAME  = 'repo.vault';
var ALGORITHM = 'aes-256-ctr';
var HEADER    = '##### Get tool to decrypt it at https://github.com/felipefdl/repovault #####';

// FS Functions
function create_repo_vault() {
    fs.writeFileSync(FILENAME, HEADER);
}

function read_repo_vault() {
    var repovault_file;
    try {
        repovault_file = fs.readFileSync(FILENAME, 'utf-8');
    } catch (e) {
        create_repo_vault();
        return [];
    }

    var splitfile = repovault_file.split('\n');
    var values = [];

    splitfile.forEach(function (value) {
        if (!value) { return; }

        values.push(value);
    });

    return values;
}

function write_repo_vault(data_string) {
    fs.appendFileSync(FILENAME, '\n' + data_string);
}

// Repovault
var repovault = read_repo_vault();
var context   = {
    "password": process.argv[2],
    "content":  process.argv[3]
};

function encrypt() {
    var content = JSON.stringify({'content': context.content});
    var cipher = crypto.createCipher(ALGORITHM, context.password);
    var crypted = cipher.update(content, 'utf8', 'hex');
    crypted += cipher.final('hex');
    return crypted;
}

function decrypt() {
    repovault.forEach(function (value) {
        var decipher = crypto.createDecipher(ALGORITHM, context.password);
        var data;
        try {
            data = decipher.update(value, 'hex', 'utf8');
            data += decipher.final('utf8');
            data = JSON.parse(data);
        } catch (e) {
            return;
        }

        if (data) {
            console.info(data.content);
        }
    });
}

if (context.password && !context.content) {
    return decrypt(context.password);
}

if (context.password && context.content) {
    return write_repo_vault(encrypt(context.password, context.content));
}
