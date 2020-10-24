// Call express to run backend server
const express = require("express");
const path = require("path");
const fs = require("fs");
const shortid = require('shortid');
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
    fs.readFile('./db/db.json', (e, data) => {
        if (e) {
            console.log(e);
            return res.json({ error: e })
        }
        return res.json(JSON.parse(data));
    })
});
app.post("/api/notes", function(req, res) {
    let newNote = {
        id: shortid.generate(),
        title: req.body.title,
        text: req.body.text,
    };
    console.log(newNote);
    fs.readFile('./db/db.json','utf8', (e, data) => {
        if (e) {
            console.log(e);
            return res.json({ error: e })
        };
        const array = JSON.parse(data);
        array.push(newNote);
        fs.writeFile(path.join(__dirname, "./db/db.json"), JSON.stringify(array), function(err) {
            if(err) {
                console.log(err);
                return res.json({ error: err })
            }
            return res.json(array)
        });
    });
})
app.delete('/api/notes/:id', async function(req, res){
    const chosen = req.params.id;
    console.log(chosen, "what is happening")
    fs.readFile('./db/db.json','utf8', (e, data) => {
        if (e) {
            console.log(e);
            return res.json({ error: e })
        };
        const array = JSON.parse(data);
        const newArray = array.filter((element) => {
            console.log('this is my element ', element);
            return element.id !== chosen
        })
        fs.writeFile('./db/db.json', JSON.stringify(newArray), function () {
            return res.json(newArray);
        })
    });
})
app.listen(PORT, function() {
    console.log("App listening on PORT " + PORT);
  });