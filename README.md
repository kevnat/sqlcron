# Node SQL Chron Automation
- Used to schedule routine SQL queries and export results to csv file.
- Implementation of nodemailer about half-way. 

## Dependencies
   - "bluebird": "^3.5.3",
   - "crontab": "1.2.0",
   - "express": "4.16.4",
   - "json2csv": "4.3.3",
   - "lodash": "^4.17.11",
   - "node-cron": "2.0.3",
   - "nodemailer": "5.1.1",
   - "oracledb": "^3.1.1",
   - "promise-mysql": "3.3.1"

## Usage

- Set queries, chron, and csv field settings in querySchedule.js 
- DB and mail settings in config.js
```
npm install
node index.js
```

