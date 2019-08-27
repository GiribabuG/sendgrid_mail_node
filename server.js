let express = require('express');

let mongoose = require('mongoose');

let bodyparser = require('body-parser');
const sgMail = require('@sendgrid/mail');
let cors = require('cors');

let app = express();

app.use(bodyparser.json());

app.use(bodyparser.urlencoded({ extended: false }));

app.use(cors());
let contact_details = mongoose.Schema({
    'fname': String,
    'lname': String,
    'email': String,
    'url': String,
    'message': String
});


let obj = mongoose.model('contact_details1', contact_details);

mongoose.connect("mongodb://localhost:27017/feet", (err) => {

    if (err)
        throw err;
    else {
        app.post("/contact", (req, res) => {
            let record = new obj({
                'fname': req.body.fname,
                'lname': req.body.lname,
                'email': req.body.email,
                'url': req.body.url,
                'message': req.body.message
            });

            record.save((err, object) => {
                if (err)
                    res.send({ 'contact': 'fail' });
                else
                    res.send({ 'contact': 'success' });

            });
            // using Twilio SendGrid's v3 Node.js Library
            // https://github.com/sendgrid/sendgrid-nodejs

            sgMail.setApiKey("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");
            const msg = {
                to: 'giribabu.g@mtwlabs.com',
                from: 'mail@feetfirstnp.org',
                subject: 'FeetFirstFoundation',
                // text: 'and easy to do anywhere, even with Node.js',
                html: 'First Name :'+record.fname +'<br/>'+'Last Name :'+ record.lname +'<br/>'+ 'Email id :'+record.email +'<br/>'+
                        'Website Url :'+record.url+'<br/>'+'Message :'+ record.message
            };
            sgMail.send(msg);
        });
    }
});

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.listen(8080);
console.log("server listening the no 8080")

