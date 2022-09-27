const express = require('express');
const router = express.Router();

router.get('/signup', (req, res) => {
    res.render('signup');
});

router.post('/signup', (req, res) => {
    const data = {
        success: true,
        errors: [],
        user: null,
    }
    console.log(req.body);
});

module.exports = router;