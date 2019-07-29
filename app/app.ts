import express = require('express');

const app: express.Application = express();

app.get('/', function (req, res) {
    res.send('Test page');
});

app.listen(3000, function () {

    console.log('Web server listening');

});
