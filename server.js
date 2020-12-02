//Dependency package needed to support application
const express = require("express");
const app = express();
const path = require("path");
const fs = require("fs");
const uuid = require("uuid");

//Assigned port for server to listen
const PORT = process.env.PORT || 3000; 



//Could be in its own file and folder to have less code in server.js
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


//Rout pointing node to notes HTML page found in the public folder
app.get("/notes", function(req, res) {
    res.sendFile(path.join(__dirname, "./public/notes.html"));
});
//Rout pointing node to index HTML page found in the public folder
app.get("/", function(req, res) {
    res.sendFile(path.join(__dirname, "./public/index.html"));
});

/*Instruction for the not to get from the Database and read the file
and dispay it.  If an error is detected an error should be thrown*/
app.get("/api/notes", (req, res) => {
    fs.readFile(path.join(__dirname, "./db/db.json"), (err, data) => {
        if (err) throw err;
        const notes = JSON.parse(data);
        res.json(notes);
    })
});

/*Instruction for the node to get the new note from the Database and read the file
an add it to the display. It will also give the new note a unique ID.
If an error is detected an error should be thrown*/
app.post("/api/notes", function(req, res) {
    fs.readFile(path.join(__dirname, "./db/db.json"), (err, data) => {
        if (err) throw err;
        const notes = JSON.parse(data);
        const newNote = req.body;
        newNote.id = uuid.v4();
        notes.push(newNote);
//Instruction that will allow the creation of after initial note is posted
        const createNote = JSON.stringify(notes);
        fs.writeFile(path.join(__dirname, "./db/db.json"), createNote, (err) =>{
            if (err) throw err;
        });
        res.json(newNote);
    });
});

//Delete Saved Notes
app.delete("/api/notes/:id", function(req, res) {
    const noteID = req.params.id;
    fs.readFile(path.join(__dirname, "./db/db.json"), (err, data) => {
        if (err) throw err;
        const notes = JSON.parse(data);
        const notesArray = notes.filter(item => {
            return item.id !== noteID
        });
        fs.writeFile('./db/db.json', JSON.stringify(notesArray), (err, data) => {
            console.log("Deletelos")
            if (err) throw err; 
            res.json(notesArray) 

        });
    });

});


app.listen(PORT, function() {
    console.log(`App listening to ${PORT}`);
});