const mongoose = require('mongoose');  // Ajoute cette ligne pour importer mongoose

mongoose.connect('mongodb://localhost:27017/chatdb')
    .then(() => {
        console.log('Database connected successfully');
    })
    .catch((err) => {
        console.error('Error connecting to the database:', err);
    });
