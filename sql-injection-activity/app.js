const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
app.use(express.static('.'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const db = new sqlite3.Database(':memory:');
db.serialize(function () {
    db.run("CREATE TABLE user (username TEXT, password TEXT, title TEXT)");
    db.run("INSERT INTO user VALUES ('admin', 'password123', 'Administrator')", function(err) {
        if (err) {
            console.log('Error inserting data:', err);
        } else {
            console.log('Database initialized with admin credentials.');
        }
    });
});

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/login', function (req, res) {
    var username = req.body.username;
    var password = req.body.password;

    // Log received credentials for debugging
    console.log('Received credentials:', { username, password });

    var query = `SELECT title FROM user WHERE username = '${username}' AND password = '${password}'`;
    console.log('Executing query:', query);

    db.get(query, function (err, row) {
        if (err) {
            console.log('ERROR:', err);
            res.redirect("/index.html#error");
        } else if (!row) {
            console.log('Invalid credentials');
            res.redirect("/index.html#unauthorized");
        } else {
            console.log('Successful login for username:', username, 'with title:', row.title);
            res.send('Hello <b>' + row.title + '!</b><br /> This file contains all your secret data: <br /><br /> SECRETS <br /><br /> MORE SECRETS <br /><br /> <a href="/index.html">Go back to login</a>');
        }
    });
});

app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});
