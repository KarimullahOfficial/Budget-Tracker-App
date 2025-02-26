 // index.js
const express = require('express');
const mongoose = require('mongoose');
const transactionRoutes = require('./route/transactionRoute');  // Assuming your route file is in 'routes' folder
const app = express();
const cors = require('cors');

 
const PORT = process.env.PORT || 800;
app.use(cors('*'));
 
const mongoURI = 'mongodb+srv://mullahbalti456:xqOPaatHWaCVzYwX@cluster0.lztnz.mongodb.net/Tracking?retryWrites=true&w=majority';

 
mongoose.connect(mongoURI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.log('Failed to connect to MongoDB:', err));

 
app.use(express.json());

 
app.get('/', (req, res) => {
  res.send({'message': 'Welcome to API'});
});

 
app.use('/api/transactions', transactionRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
