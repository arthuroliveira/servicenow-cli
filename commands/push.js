/**
 * Created by arthur.oliveira on 2/15/16.
 */
var inquirer = require("inquirer");
var require_config = require("../helper/config_validator");
var ServiceNow = require("../services/servicenow");


var service;
module.exports = function (program) {
    program
        .command("push")
        .description("Run this command to push files to ServiceNow")
        .usage('<file>')
        .action(function (file) {
            require_config().then(function (config) {
                console.log(file);
            });
        });
};