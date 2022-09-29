const express = require('express');
const router = express.Router();
const mysqlCon = require('../utils/database');
const Promise = require('promise');

function getBusinessDetailsFromUri(businessUri) {
    const queryData = {
        error: null,
        results: [],
    }

    return new Promise((resolve, reject) => {
        const sql = `
        SELECT * FROM users WHERE business_uri = '${businessUri}' LIMIT 1;
        `
        console.log(sql);
        mysqlCon.query(
            sql,
            (error, results, fields) => {
                if (!error) {
                    Object.keys(results).forEach(function(key) {
                        var row = results[key];
                        queryData.results.push(row);
                    });
                    resolve(queryData);
                } else {
                    queryData.error = error;
                    reject(queryData);
                }

            }
        )
    });
}

router.get('/:businessUri', (req, res) => {
    const businessUri = req.params.businessUri;

    res.render('business-front', {businessUri});

}).post('/details', (req, res) => {
    //get business details
    getBusinessDetailsFromUri(req.body.businessUri).then((businessData) => {
        console.log(businessData);
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(businessData));
    });
});


module.exports = router;