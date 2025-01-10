const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const PORT = 3000;

// Middleware to parse JSON requests
app.use(bodyParser.json());

// Temporary in-memory storage for reported websites
let reportedWebsites = [];

// Endpoint to receive reported websites
app.post('/reports', (req, res) => {
    const { url, timestamp } = req.body;
    if (url && timestamp) {
        reportedWebsites.push({ url, timestamp });
        console.log('New report received:', { url, timestamp });
        res.status(200).json({ message: 'Report saved successfully', data: { url, timestamp } });
    } else {
        res.status(400).json({ message: 'Invalid report data' });
    }
});

// Endpoint to view all reports
app.get('/reports', (req, res) => {
    res.status(200).json(reportedWebsites);
});

// Start the server
app.listen(PORT, () => {
    console.log(`Backend running on http://localhost:3000`);
});
