/**
 * Created by arthur.oliveira on 2/15/16.
 */
var inquirer = require("inquirer");
var config_helper = require("../helper/config_validator");

module.exports = function (program) {
    program
        .command("pull")
        .description("Run this command to pull files from ServiceNow")
        .action(function () {
            console.log(config_helper);
        });

    return program;
};
