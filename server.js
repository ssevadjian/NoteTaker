// Call express to run backend server
const express = require("express");
const path = require("path");
const fs = require("fs");
const db = require("./db/db.json");
const shortid = require('shortid');
const dbJs = require('./db/db');
// Set up the Express App
const app = express();
// Creating a port deployable via Heroku
const PORT = process.env.PORT || 3001;
// Set-up middleware
app.use(express.urlencoded({extended: true}));
app.use(express.json());
// Deliver public folder from server to user via static method
app.use(express.static("public"));
// Create basic routes that sends user to HTML views
app.get("/notes", function(req,res) {
    res.sendFile(path.join(__dirname, "/public/notes.html"));
});
app.get("/", function(req, res) {
    res.sendFile(path.join(__dirname, "/public/index.html"));
});
// Create API routes
app.get("/api/notes", function(req, res) {
    return res.json(db);
});
app.post("/api/notes", function(req, res) {
    let newNote = {
        id: shortid.generate(),
        title: req.body.title,
        text: req.body.text,
    };
    console.log(newNote);
    db.push(newNote);
    fs.writeFileSync(path.join(__dirname, "./db/db.json"), JSON.stringify(db));
    return res.json(db)
})
app.delete("api/notes/:id" , function(req, res) {
    console.log("i'm inside app deleter function");
    console.log("id is " + req.params.id);
    dbJs.deleteNote(req.params.id).then(() => res.send(200))
    .catch((err) => console.log(err));
});
app.listen(PORT, function() {
    console.log("App listening on PORT " + PORT);
  });