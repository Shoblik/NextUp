const express = require('express');
const router = express.Router();
const mysqlCon = require('../utils/database');

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
            INSERT INTO users (name, email, business, business_uri, updated_at, created_at)
            VALUES('${req.body.name}','${req.body.email}','${req.body.business}', '${businessUri}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
        `;

        mysqlCon.query(
            sql,
            (error, results, fields) => {
                if (!error) {
                    data['businessUri'] = businessUri;
                    data['user'] = true;
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


module.exports = router;