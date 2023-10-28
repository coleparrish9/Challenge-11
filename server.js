const express = require('express');
const path = require('path');
const fs = require('fs');

const uuid = require('./helpers/uuid');

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/index.html'))
);

app.get('/notes', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/notes.html'))
);

app.post('/api/notes', (req, res) => {

    console.info(`${req.method} request received to post a note.`)

    const { title, text } = req.body;
    if (title && text) {

        const note = {
            title,
            text,
            id: uuid(),
        };

        fs.readFile('./db/db.json', 'utf8', (err, data) => {
            if (err) {
                console.error(err);
            } else {

                const parsedNotes = JSON.parse(data);

                parsedNotes.push(note);

                fs.writeFile(`./db/db.json`, JSON.stringify(parsedNotes),
                    (writeErr) =>
                        writeErr ? console.error(err) : console.info('A new note has been written to JSON file')
                );
            }
        });

        const response = {
            status: 'success',
            body: note,
        };

        console.log(response);
        return res.status(201).json(response);
    } else {
        res.status(500).json('Error in posting note');
    }
});


app.get('/api/notes', (req, res) => {

    fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
        } else {
            return res.status(201).json(JSON.parse(data));
        }
    });
});


app.get('*', (req, res) => {
    res.send('<a href="/"> Nothing to see here. Navigate back to the homepage?</a>');
});


app.listen(PORT, () =>
    console.log(`App listening at http://localhost:${PORT}`)
);