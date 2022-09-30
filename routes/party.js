const express = require('express');
const router = express.Router();
const mysqlCon = require('../utils/database');
const Promise = require('promise');

function addParty(businessId, name, phone, partySize) {
    const queryData = {
        error: null,
        added: false,
        id: null
    }

    return new Promise((resolve, reject) => {
        const sql = `
        INSERT INTO parties (business_id, name, phone, party_size, created_at, updated_at)
        VALUES('${businessId}', '${name}', '${phone}', '${partySize}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
        `;

        mysqlCon.query(
            sql,
            (error, results, fields) => {
                if (!error) {
                    queryData.id = results.insertId;
                    queryData.added = true;
                    resolve(queryData);
                } else {
                    queryData.error = error;
                    reject(queryData);
                }
            }
        )
    });
}

router.post('/add', (req, res) => {
    const name = req.body.name;
    const phone = req.body.phone;
    const partySize = req.body.partySize;
    const businessId = req.body.businessId;

    addParty(businessId, name, phone, partySize).then((queryResult) => {
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(queryResult));
    });
})


module.exports = router;