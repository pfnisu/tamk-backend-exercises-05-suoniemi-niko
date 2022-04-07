const express = require('express');
const app = express();

const db = [{ name: 'tiina' }, { name: 'jack' }];

app.get('/names', (req, res) => {
    res.send(db);
});

const server = app.listen(8080, () => {
    console.log(`Listening on port ${server.address().port}`);
}); 
