const db = require('./db.js').connection;
const locations = require('./locations.js');
const express = require('express');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 8080;

// Main function
(async () => {
    try {
        await db.connect();
        app.use(express.json());
        app.use(cors());
        //app.use((req, res, next) => {
        //    res.header('Access-Control-Allow-Origin', '*');
        //    next();
        //});
        app.use('/locations', locations);

        const server = app.listen(port, () => {
            console.log('Listening on port ' + port);
        });
        process.on('SIGINT', async () => {
            await db.close();
            server.close(() => process.exit(1));
        });
    } catch (err) {
        console.log(err);
    }
})();
