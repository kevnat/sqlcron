var config = {
    production: {
        database: {
            user: 'user',
            password: 'pass',
            // connectString: 'localhost'
        },
        server: {
            host:   '127.0.0.1',
            port:   '3300'
        },
        // TO DO!!! 
        // mailer: {
        //         transporter: {
                    // host: "",
        //             secureConnection: true,
        //             port: 443,
        //             auth: {
        //                     user: "",
        //                     pass: ""
        //                 }
        //         },
        mailer: {
            transporter: {
                service: 'gmail',
                auth: {
                    user: 'sender@gmail.com',
                    pass: 'email-pass'
                }
            },
            options: {
                from: 'sender@gmail.com', // sender address
                to: 'receipient@gmail.com' // list of receivers
            }
        }
        }
    };

    module.exports = config;
    
    