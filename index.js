#!/usr/bin/env node
var Client = require('node-rest-client').Client;
var inquirer = require("inquirer");
var program = require('commander');

require('./commands')(program);

program
    .version('0.0.1')
    .parse(process.argv);

