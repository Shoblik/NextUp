const express = require('express');
const app = express();

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }))

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('index')
});

const userRouter = require('./routes/user');

app.use('/user', userRouter);

app.listen(3000)