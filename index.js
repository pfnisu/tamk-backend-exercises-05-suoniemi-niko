const locations = require('./locations.js');
const express = require('express');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 8080;

// Main function
(async () => {
    try {
        app.use(express.json());
        app.use(cors());
        app.use(express.static("frontend/build"));
        app.use('/locations', locations);

        const server = app.listen(port, () => {
            console.log('Listening on port ' + port);
        });
        process.on('SIGINT', async () => {
            server.close(() => {
                console.log('Server closed.');
                process.exit(1)
            });
        });
    } catch (err) {
        console.log(err);
    }
})();
