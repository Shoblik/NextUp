const express = require('express');
const app = express();

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }))

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('index')
});

app.get('/user/signup', (req, res) => {
    res.render('signup');
});

app.post('/user/signup', (req, res) => {
    const data = {
        success: true,
        errors: [],
        user: null,
    }

    

    console.log(req.body);
});

app.listen(3000)