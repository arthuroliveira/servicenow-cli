/**
 * Created by arthur.oliveira on 2/15/16.
 */
var inquirer = require("inquirer");
var require_config = require("../helper/config_validator");
var ServiceNow = require("../services/servicenow");

var service;
module.exports = function (program) {
    program
        .command("pull")
        .description("Run this command to pull files from ServiceNow")
        .action(function () {
            require_config().then(function (config) {

                service = ServiceNow('content_css', config);

                service.getRecords({query:"nameSTARTSWITHfidelity__"}, function(err, data){
                    console.log(data);
                });

                for (folder in config.folders) {
                    console.log(folder);
                }


                //var questions = [
                //    {
                //        type: "input",
                //        name: "table",
                //        message: "What table would you like to fetch? ",
                //        default: "incident"
                //    }];
                //
                //inquirer.prompt(questions, function (answers) {
                //    var service = ServiceNow(answers.table, config);
                //
                //
                //    service.getRecords({rows: 10, name: "fidelity__homepage"}, function (err, obj) {
                //        if (err) {
                //            console.log("ERROR " + err);
                //        }
                //
                //        console.log(JSON.stringify(obj));
                //    });
                //});

            });
        });

    return program;
};
