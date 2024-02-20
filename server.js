const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

// Route to return notes.html
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/notes.html'));
});
  
// Route to return index.html for all other routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'));
});

app.get('/api/notes', (req, res) => {
    fs.readFile(path.join(__dirname, 'db','db.json'), 'utf8', (err, data) => {
      if (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to read data from the database.' });
        return;
      }
  
      const notes = JSON.parse(data);
      res.json(notes);
    });
  });

// Route to add a new note
app.post('/api/notes', (req, res) => {
    fs.readFile(path.join(__dirname,'db', 'db.json'), 'utf8', (err, data) => {
      if (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to read data from the database.' });
        return;
      }
  
      const notes = JSON.parse(data);
      const newNote = req.body;
      newNote.id = generateUniqueId(notes); // Function to generate a unique ID
      notes.push(newNote);
  
      fs.writeFile(path.join(__dirname,'db', 'db.json'), JSON.stringify(notes), (err) => {
        if (err) {
          console.error(err);
          res.status(500).json({ error: 'Failed to write data to the database.' });
          return;
        }
  
        res.json(newNote);
      });
    });
  });

  // Route to delete a note by ID
app.delete('/api/notes/:id', (req, res) => {
    const noteId = parseInt(req.params.id); // Parse note ID from URL parameter
  
    fs.readFile(path.join(__dirname, 'db', 'db.json'), 'utf8', (err, data) => {
      if (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to read data from the database.' });
        return;
      }
  
      let notes = JSON.parse(data);
      const updatedNotes = notes.filter(note => note.id !== noteId); // Filter out the note to be deleted
  
      // Check if the note was found and deleted
      if (notes.length === updatedNotes.length) {
        res.status(404).json({ error: 'Note not found.' });
        return;
      }
  
      // Write updated notes back to the database file
      fs.writeFile(path.join(__dirname, 'db', 'db.json'), JSON.stringify(updatedNotes), (err) => {
        if (err) {
          console.error(err);
          res.status(500).json({ error: 'Failed to write data to the database.' });
          return;
        }
  
        res.status(200).json({ message: 'Note deleted successfully.' });
      });
    });
  });
  
  // Function to generate a unique ID
  function generateUniqueId(notes) {
    let id = 1;
    while (notes.find(note => note.id === id)) {
      id++;
    }
    return id;
  }


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });