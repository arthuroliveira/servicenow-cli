/**
 * Created by arthur.oliveira on 2/15/16.
 */
var inquirer = require("inquirer");
var require_config = require("../helper/config_validator");
var ServiceNow = require("../services/servicenow");

module.exports = function (program) {
    program
        .command("pull")
        .description("Run this command to pull files from ServiceNow")
        .action(function () {
            require_config(function(config){
                console.log(config.host);


            });
        });

    return program;
};
