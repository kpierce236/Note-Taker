const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

// Route to return notes.html
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/notes.html'));
});
  
// Route to return index.html for all other routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'));
});