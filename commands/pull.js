/**
 * Created by arthur.oliveira on 2/15/16.
 */
var inquirer = require("inquirer");
var require_config = require("../helper/config_validator");
var ServiceNow = require("../services/servicenow");

var fs = require('fs');
var path = require('path');

var service;
module.exports = function (program) {
    program
        .command("pull")
        .description("Run this command to pull files from ServiceNow")
        .action(function () {
            require_config().then(function (config) {
                service = ServiceNow(config);

                var destination = path.join(process.cwd(), 'dist');
                if (!fs.existsSync(destination)) {
                    fs.mkdirSync(destination);
                }


                var questions = [{
                    type: "checkbox",
                    name: "table",
                    message: "What table(s) do you want to pull?",
                    choices: Object.keys(config.folders)
                },
                    {
                        type: "confirm",
                        name: "specific_confirm",
                        message: "Do you wanna pull a specific name?"
                    },
                    {
                        type: "input",
                        name: "specific",
                        message: "What filename do you want to pull?",
                        when: function (answers) {
                            return answers.specific_confirm;
                        }
                    }
                ];

                inquirer.prompt(questions, function (answers) {

                    for (key in answers.table) {

                        var folder = answers.table[key];


                        (function () {

                            var fname = folder;
                            var folder_path = path.join(destination, folder);

                            fs.mkdir(folder_path, function (err) {
                                if (err) {
                                    if (err.code != 'EEXIST') {
                                        console.log(err); // something else went wrong
                                        return;
                                    }
                                }


                                var tableName = config.folders[fname].table;
                                service.tableName = tableName;
                                var query;
                                if (answers.specific) {
                                    query = config.folders[fname].key + "STARTSWITH" + answers.specific;
                                } else {
                                    query = config.folders[fname].key + "STARTSWITH" + config.project_prefix;
                                }

                                service.getRecords({
                                    query: query,
                                    rows: 50
                                }, function (err, data) {
                                    if (err) {
                                        console.log(err);
                                    } else {
                                        data.records.forEach(function (element, index) {
                                            var content = element[config.folders[fname].field];
                                            var filename = element.name;
                                            var filenameWithExtension = filename + "." + config.folders[fname].extension;
                                            var file_path = path.join(folder_path, filenameWithExtension);

                                            fs.writeFile(file_path, content, function (err) {
                                                if (err) {
                                                    console.log("ERR", err);
                                                } else {
                                                    console.log("Touching file " + file_path);
                                                }
                                            });
                                        });
                                    }
                                });


                            });
                        })();
                    }
                });

            });
        });

    return program;
};