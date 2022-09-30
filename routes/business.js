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
        SELECT * FROM business 
        WHERE business_uri = '${businessUri}' 
        LIMIT 1;
        `
         mysqlCon.query(
            sql,
            (error, results, fields) => {
                if (!error) {
                    Object.keys(results).forEach(function(key) {
                        let row = results[key];
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

    const sql = `
    INSERT INTO business (name, email, business, business_uri, updated_at, created_at)
    VALUES('${req.body.name}','${req.body.email}','${req.body.business}', '${businessUri}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
`;

    mysqlCon.query(
        sql,
        (error, results, fields) => {
            if (!error) {
                data['businessUri'] = businessUri;
                data['user'] = true;
                data['id'] = results.insertId;

                res.setHeader('Content-Type', 'application/json');
                res.send(JSON.stringify(data));
            } else {
                data['errors'] = error;
                data['user'] = false;
                res.setHeader('Content-Type', 'application/json');
                res.send(JSON.stringify(data));
            }
        }
    )
});

router.get('/:businessUri', (req, res) => {
    const businessUri = req.params.businessUri;
    const businessId = req.query.id;

    res.render('business-front', {businessUri, businessId});

}).post('/details', (req, res) => {
    //get business details
    getBusinessDetailsFromUri(req.body.businessUri).then((businessData) => {
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(businessData));
    });
});

module.exports = router;