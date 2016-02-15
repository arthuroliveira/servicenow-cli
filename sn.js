#!/usr/bin/env node
//var servicenow = require('servicenow');
//var config = {
//    instance: "https://aoliveira1.service-now.com",
//    username: "admin",
//    password: "arthur"
//};
//var client = new servicenow.Client(config);
//client.getRecords("incident","Active=true",function(error,result) {
//    if(!error) {
//         console.log(result);
//    } else {
//        console.log(error);
//    }
//
//});


var request = require('request');
var querystring = require('querystring');


var snrequest = request.defaults({
    auth: {
        user: "admin",
        pass: "arthur",
        sendImmediately: true
    },
    headers: {
        "Content-Type": "application/json"
    }
});



var params = querystring.stringify({
    "sysparm_action": "getRecords",
    "sysparm_query": "",
    "displayvalue": true,
    "displayvariables" : true
});

var url = "https://aoliveira1.service-now.com" + "/oauth_entity_list.do?JSONv2=&";
snrequest.get(url + params, function(err,response,body) {
    var r = JSON.parse(body);

    console.log(err);
    console.log(response);
});