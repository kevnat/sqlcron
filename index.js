const fs = require('fs');
const mysql = require('promise-mysql');
const json2csv = require('json2csv').parse;
const fields = ['merchid','merchid2','cardproc','name1','name2','street','city','country','timezone','zip','phone','mcc','motoeci','bin','storeterm','agentchain','terminal','location','alias','maxamount','minamount','billpay','currency','taxid','site','customerid','lastupdated','cdthreshold','cdreview','disabled','activationdate','schemaname','maxcredit','properties','modifieduser'];
const opts = { fields };
const cron = require('node-cron');
const express = require('express');
const nodemailer = require('nodemailer');

app = express();

cron.schedule("* * * * *", function(){
    console.log("------------------");
    console.log("Running Cron Job");
    try {
        mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: 'root',
            database: 'gateway'
        }).then(function(conn){
            //query the database
            let result = conn.query('select * from merchants');
            conn.end();
            return result;
        }).then(function(result){
            //convert result json into csv using opts declared above
            try {
                const csv = json2csv(result, opts);
                // console.log(csv);
                return csv;
            } catch (err) {
                console.error(err);
            }
        }).then(function(csv){
            //write csv results file in /tmp dir
            let now = new Date(); 
            let label = "cc_loi_" + JSON.stringify(now).replace(/['"]+/g, '') + ".csv";
            console.log(label);
            fs.writeFile("/tmp/" + label, csv, function(err) {
                if(err) {
                    return console.log(err);
                } console.log(label + " was saved in /tmp");
            })
            return label;
        }).then(function(label){
            console.log("within nodemailer"+label);
            //send email with file
            let transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'sqlcrontest@gmail.com',
                    pass: 'newthing123'
                }
            })
            const mailOptions = {
                from: 'sqlcrontest@gmail.com', // sender address
                to: 'kevmaxnathan@gmail.com', // list of receivers
                subject: 'Nodemailer Test 2', // Subject line
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
            let label = JSON.stringify(now).replace(/['"]+/g, '');
            console.log(label);
            fs.writeFile("/tmp/log_" + label + ".txt", error, function(err) {
                if(err) {
                    return console.log(err);
                } console.log("The file was saved in /tmp/log");
            })
            console.log("in logger");
        })
    } catch (error){ 
        console.log(error);
    };
});

app.listen("3128");
