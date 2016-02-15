#!/usr/bin/env node
var servicenow = require('servicenow');
var config = {
    instance: "https://aoliveira1.service-now.com",
    username: "admin",
    password: "arthur"
};
var client = new servicenow.Client(config);
client.getRecords("incident","Active=true",function(error,result) {
    if(!error) {
         console.log(result);
    } else {
        console.log(error);
    }

});