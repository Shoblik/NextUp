const express = require('express');
const router = express.Router();
const mysqlCon = require('../utils/database');
const Promise = require('promise');
const BusinessModel = require('../models/BusinessModel');

router.get('/signup', (req, res) => {
    res.render('signup');
})
.post('/signup', (req, res) => {
    const data = {
        success: true,
        errors: [],
        user: null,
        id: null
    }

    // clean the business name so there are no spaces
    const businessUri = req.body.business.replace(new RegExp(' ', 'g'), '-');

    // Sends from here
    BusinessModel.businessSignUp(req.body.name, req.body.email, req.body.business, businessUri, data, res);
 
    // todo: log new sign up or something
    
});

router.get('/:businessUri', (req, res) => {
    const businessUri = req.params.businessUri;

    res.render('business-front', {businessUri});

}).post('/details', (req, res) => {
    const data = {
        error: null,
        results: [],
    }

    // Sends from here
    BusinessModel.getBusinessDetailsFromUri(req.body.businessUri, data, res);
});

module.exports = router;