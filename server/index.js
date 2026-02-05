const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const generateRoutes = require('./routes/generate');
const chatRoutes = require('./routes/chat');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

app.use('/api/generate', generateRoutes);
app.use('/api/chat', chatRoutes);

app.get('/', (req, res) => {
    res.send('EchoRepo API is running');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
