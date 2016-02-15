#!/usr/bin/env node
var co = require('co');
var prompt = require('co-prompt');
var Client = require('node-rest-client').Client;


var program = require('commander');

//require('./commands')(program);


program
    .command("get-hash")
    .description("Run this command to create/update the HASH used on webservice")
    .action(function () {
        co(function *() {
            var client = new Client();

            var username = yield prompt('Username: ');
            var password = yield prompt.password("Password: ");

            var args = {
                parameters: {
                    grant_type: "password",
                    client_id: "dd91abb1d06952001c186e0fc473f04f",
                    //client_secret: "test",
                    username: username,
                    password: password
                },
                headers: {"Content-Type": "application/x-www-form-urlencoded"}
            };

            client.post("https://aoliveira1.service-now.com/oauth_token.do", args, function (data, response) {
                console.log(data);
            });


            process.stdin.pause();
        })();
    });


program
    .version('0.0.1')
    .parse(process.argv);

