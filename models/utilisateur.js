const mongoose = require('mongoose');

// Schéma pour un utilisateur
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
});

// Créer le modèle User basé sur le schéma
const User = mongoose.model('User', userSchema);

// Exporter le modèle
module.exports = User;
