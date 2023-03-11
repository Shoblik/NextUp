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

    res.setHeader('Content-Type', 'application/json');

    // clean the business name so there are no spaces
    const businessUri = req.body.business.replace(new RegExp(' ', 'g'), '-');

    BusinessModel.businessSignUp(req.body.name, req.body.email, req.body.business, businessUri, data, res).then(queryData => {
        data.user = true;
        data.id = queryData.id;
        data.businessUri = queryData.businessUri;
        
        res.send(JSON.stringify(data));
    }).catch(error => {
        data.errors.push('Failed to signup.');

        res.send(JSON.stringify(data));
        console.log(error);

        // do some logging
    });
 
    
});

router.get('/:businessUri', (req, res) => {
    const businessUri = req.params.businessUri;

    res.render('business-front', {businessUri});

}).post('/details', (req, res) => {
    const data = {
        error: null,
        results: [],
    }

    res.setHeader('Content-Type', 'application/json');

    BusinessModel.getBusinessDetailsFromUri(req.body.businessUri).then(queryData => {
        data.results = queryData;
        
        res.send(JSON.stringify(data));
    }).catch(errors => {
        
        res.send(JSON.stringify(data));
        console.log(errors);

        //do some logging
    });
});

module.exports = router;