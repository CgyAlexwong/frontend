const db = require('./db');

const express = require('express');
const app = express();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
// const urlencodedParser = bodyParser.urlencoded({extended: false});

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

app.post('/LoginController/login', jsonParser, async (req, res) => {
    console.log(req.body);
    let emailAddress = req.body.emailAddress;
    let password = req.body.password;
    let captcha = req.body.captcha;
    let result = {
        isSucceed: false,
        information: '-2'
    };
    // let user = await JSON.parse(db.get(emailAddress));
    let user = await db.get(emailAddress);
    user = JSON.parse(user);
    if (user !== {}) {
        if (user.password === password) {
            if (captcha === '123') {
                result.isSucceed = true;
                result.information = user.username;
            } else {
                result.information = '0';
            }
        } else {
            result.information = '-1';
        }
    }
    res.json(result);
})
;

app.listen(3121, () => {
    console.log('I\'m listening on port 3121!')
});
