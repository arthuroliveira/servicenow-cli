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
                var destination = path.join(process.cwd(), 'dist');
                if (!fs.existsSync(destination)) {
                    fs.mkdirSync(destination);
                }

                service = ServiceNow(config);

                for (folder in config.folders) {
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

                            service.getRecords({
                                query: config.folders[fname].key + "STARTSWITH" + config.project_prefix,
                                row: 50
                            }, function (err, data) {
                                if (err) {
                                    console.log(err);
                                } else {
                                    data.records.forEach(function (element, index) {
                                        var content = element[config.folders[fname].field];
                                        var filename = element.name + "." + config.folders[fname].extension;
                                        var file_path = path.join(folder_path, filename);

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
