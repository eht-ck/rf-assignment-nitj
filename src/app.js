const express = require('express');
require('dotenv').config();
const path = require('path');
const docRoutes = require('./api/docRoutes');  // Adjust the import path based on your directory structure
const app = express();

// Middleware to serve static files from the 'public' directory at the root level
app.use(express.static('public'));
// This should now point correctly to 'public' folder

// Middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root route to serve the HTML file from the 'public' folder
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));  // Serve index.html from the public folder
});

// Use docRoutes for API routes under /api/docs
app.use('/api/docs', docRoutes);

// Set up the server to listen on a specified port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}...`);
});
