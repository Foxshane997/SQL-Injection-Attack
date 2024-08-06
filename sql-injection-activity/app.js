const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = 3000;

// Database setup
let db = new sqlite3.Database(':memory:');
db.serialize(() => {
    db.run("CREATE TABLE user (username TEXT, password TEXT)");
    let stmt = db.prepare("INSERT INTO user VALUES (?, ?)");
    // Declared Username & Password here
    stmt.run("admin", "password123");
    stmt.finalize();
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Serve HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Handle login form submission
app.post('/login', (req, res) => {
    let username = req.body.username;
    let password = req.body.password;

    let query = `SELECT username FROM user WHERE username = '${username}' AND password = '${password}'`;
    console.log(`Username: ${username}`);
    console.log(`Password: ${password}`);
    console.log(`SQL Query: ${query}`);

    db.get(query, (err, row) => {
        if (err) {
            console.error(err);
            res.send("Error occurred.");
        } else if (row) {
            res.send("Login successful!");
        } else {
            res.send("Invalid login.");
        }
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
