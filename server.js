const express = require('express');
const app = express();
const businessRouter = require('./routes/business');
const partyRouter = require('./routes/party');

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }))

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('index')
});

app.use('/business', businessRouter);
app.use('/party', partyRouter);

app.listen(3000);