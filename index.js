const fs = require('fs');
const mysql = require('promise-mysql');
const json2csv = require('json2csv').parse;
const fields = ['merchid','merchid2','cardproc','name1','name2','street','city','country','timezone','zip','phone','mcc','motoeci','bin','storeterm','agentchain','terminal','location','alias','maxamount','minamount','billpay','currency','taxid','site','customerid','lastupdated','cdthreshold','cdreview','disabled','activationdate','schemaname','maxcredit','properties','modifieduser'];
const opts = { fields };
const cron = require('node-cron');
const express = require('express');
// let nodemailer = required('nodemailer');

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
            let result = conn.query('select * from merchants');
            conn.end();
            return result;
        }).then(function(result){
            try {
                const csv = json2csv(result, opts);
                console.log(csv);
                return csv;
            } catch (err) {
                console.error(err);
            }
        }).then(function(csv){
            let now = new Date(); 
            let label = JSON.stringify(now);
            console.log(label);
            fs.writeFile("/tmp/cc_loi_" + label.replace(/['"]+/g, '') + ".csv", csv, function(err) {
                if(err) {
                    return console.log(err);
                } console.log("The file was saved in /tmp");
            })
        }).catch(function(error){
            let now = new Date(); 
            let label = JSON.stringify(now);
            console.log(label);
            fs.writeFile("/tmp/log_" + label.replace(/['"]+/g, '') + ".csv", error, function(err) {
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
