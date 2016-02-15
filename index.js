#!/usr/bin/env node
var Client = require('node-rest-client').Client;
var inquirer = require("inquirer");
var program = require('commander');

require('./commands')(program);

program
    .command("get-hash")
    .description("Run this command to create/update the HASH used on webservice")
    .action(function () {
        var client = new Client();

        inquirer.prompt(questions, function (answers) {
            var args = {
                parameters: {
                    grant_type: "password",
                    client_id: "dd91abb1d06952001c186e0fc473f04f",
                    client_secret: "PnJc[y+l5[",
                    username: answers.username,
                    password: answers.password
                },
                headers: {"Content-Type": "application/x-www-form-urlencoded"}
            };

            client.post("https://aoliveira1.service-now.com/oauth_token.do", args, function (data, response) {
                console.log(data);
            });



        });
    });


program
    .version('0.0.1')
    .parse(process.argv);

