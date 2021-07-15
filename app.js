const express = require("express");
const app = express();
const path = require("path");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

app.use(express.static("public"));
app.use(bodyParser.urlencoded({
    extended: true
}));

app.get("/", function (req, res) {
    var options = {
        root: path.join(__dirname)
    };
    var fileName = "signup.html";
    res.sendFile(fileName, options, function (err) {
        if (err) {
            next(err);
        } else {
            console.log('Sent:', fileName);
        }
    });
});

app.post("/", function (req, res) {
    const fname = req.body.fname;
    const lname = req.body.lname;
    const email = req.body.email;
    //console.log(fname, lname, email);
    var data = {
        members: [{
            email_address: email,
            status: "subscribed",
            merge_fields: {
                FNAME: fname,
                LNAME: lname
            }
        }]
    }
    var jsonData = JSON.stringify(data);
    const url = "https://us6.api.mailchimp.com/3.0/lists/d47c969d5a";
    const option = {
        method: "POST",
        auth: "shubham1:3a9afc0068e04f26dc7463ec157ac3b6-us6"
    }
    const request = https.request(url, option, function (response) {
        var options = {
            root: path.join(__dirname)
        };
        var fileName;
        if (response.statusCode === 200) {
            fileName = "success.html";
        } else {
            fileName = "failure.html";
        }
        res.sendFile(fileName, options, function (err) {
            if (err) {
                next(err);
            } else {
                console.log('Sent:', fileName);
            }
        });

        response.on("data", function (data) {
            console.log(JSON.parse(data));
        })
    });
    request.write(jsonData);
    request.end();
});

app.post("/failure", function(req, res){
    res.redirect("/");
});

app.listen(process.env.PORT || 3000, function () {
    console.log("Server is running on port 3000");
});

// API KEY
// 3a9afc0068e04f26dc7463ec157ac3b6-us6
// List Id
// d47c969d5a