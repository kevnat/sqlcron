const fs = require('fs');
const config = require('./config');
const querySchedule = require('./querySchedule');
const cron = require('node-cron');
const express = require('express');
const oracledb = require('oracledb');
oracledb.outFormat = oracledb.OBJECT; 
oracledb.Promise = bluebird;
const nodemailer = require('nodemailer');
const bluebird = require('bluebird');
const json2csv = require('json2csv').parse;
//** alternative to setting fields in querySchedule.js
// const fields = require('./config');
// const opts = {fields};

app = express();

// //setup to run every minute
// Run query_one from Query Schedule
let task1 = cron.schedule(querySchedule.one.schedule, function(){
    console.log("------------------");
    console.log("Running First Job - query_one");
    try {
        // try to create the db connection
        oracledb.getConnection(config.production.database)
        .then(function(conn) {
            //query the database
            return conn.execute(
                //query input from querySchedule.js
                querySchedule.one.query
            ).then(function(result) {
                let jsonResult = result.rows;
                conn.close();
                return jsonResult;
            })
            .catch(function(err) {
              console.error(err);
              return conn.close();
            });
        })
        .catch(function(err) {
          console.error(err);
        }).then(function(jsonResult){
            //convert result json into csv using fields set in querySchedule
            try {
                const csv = json2csv(jsonResult, querySchedule.one.fields);
                console.log("csv file for query one results created...");
                return csv;
            } catch (err) {
                console.error(err);
            }
        }).then(function(csv){
            //write csv results file in /tmp dir
            let now = new Date(); 
            let label = "query_one_res_" + JSON.stringify(now).replace(/['"]+/g, '') + ".csv";
            fs.writeFile("/tmp/" + label, csv, function(err) {
                if(err) {
                    return console.log(err);
                } console.log(label + " was saved in /tmp");
            })
            return label;
        }).then(function(label){
            //send email with file
            let transporter = nodemailer.createTransport(config.production.mailer.transporter);
            const mailOptions = {
                from: config.production.mailer.options.from, // sender address
                to: config.production.mailer.options.to, // list of receivers
                subject: 'Query One', // Subject line
                html: '<p>See attached csv</p>',// plain text body
                attachments: [{
                    filename: label,
                    path: "/tmp/" + label 
                }]
              };
              transporter.sendMail(mailOptions, function (err, info) {
                if(err)
                  console.log(err)
                else
                  console.log(info);
             });
        }).catch(function(error){
            //write any errors to log file in /log directory
            let now = new Date(); 
            let logLabel = "log_" + JSON.stringify(now).replace(/['"]+/g, '') + ".txt";
            console.log(label);
            fs.writeFile("/tmp/log" + logLabel , error, function(err) {
                if(err) {
                    return console.log(err);
                } console.log(logLabel + "was saved in /tmp/log");
            })
        })
    } 
    catch (error){ 
        console.log(error);
    };
});

//ISV Lineitem Tab
let task2 = cron.schedule(querySchedule.two.schedule, function(){
    console.log("------------------");
    console.log("Running First Job - query_two");
    try {
        // try to create the db connection
        oracledb.getConnection(config.production.database)
        .then(function(conn) {
            //query the database
            return conn.execute(
                //query input from querySchedule.js
                querySchedule.two.query
            ).then(function(result) {
                let jsonResult = result.rows;
                conn.close();
                return jsonResult;
            })
            .catch(function(err) {
              console.error(err);
              return conn.close();
            });
        })
        .catch(function(err) {
          console.error(err);
        }).then(function(jsonResult){
            //convert result json into csv using fields set in querySchedule
            try {
                const csv = json2csv(jsonResult, querySchedule.two.fields);
                console.log("csv file for query one results created...");
                return csv;
            } catch (err) {
                console.error(err);
            }
        }).then(function(csv){
            //write csv results file in /tmp dir
            let now = new Date(); 
            let label = "query_one_res_" + JSON.stringify(now).replace(/['"]+/g, '') + ".csv";
            fs.writeFile("/tmp/" + label, csv, function(err) {
                if(err) {
                    return console.log(err);
                } console.log(label + " was saved in /tmp");
            })
            return label;
        }).then(function(label){
            //send email with file
            let transporter = nodemailer.createTransport(config.production.mailer.transporter);
            const mailOptions = {
                from: config.production.mailer.options.from, // sender address
                to: config.production.mailer.options.to, // list of receivers
                subject: 'Query Two', // Subject line
                html: '<p>See attached csv</p>',// plain text body
                attachments: [{
                    filename: label,
                    path: "/tmp/" + label 
                }]
              };
              transporter.sendMail(mailOptions, function (err, info) {
                if(err)
                  console.log(err)
                else
                  console.log(info);
             });
        }).catch(function(error){
            //write any errors to log file in /log directory
            let now = new Date(); 
            let logLabel = "log_" + JSON.stringify(now).replace(/['"]+/g, '') + ".txt";
            console.log(label);
            fs.writeFile("/tmp/log" + logLabel , error, function(err) {
                if(err) {
                    return console.log(err);
                } console.log(logLabel + "was saved in /tmp/log");
            })
        })
    } 
    catch (error){ 
        console.log(error);
    };
});


try {
    task1.start();
    task2.start();
} catch(err) {
    console.error(err);
    task1.stop();
    task2.stop();
}

app.listen(config.production.server.port, function(){
    console.log("server listening on port: "+ config.production.server.port )
});