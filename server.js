const express = require('express');
const app = express();
const userRouter = require('./routes/user');
const businessRouter = require('./routes/business');

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }))

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('index')
});

app.use('/user', userRouter);
app.use('/business', businessRouter);

app.listen(3000)