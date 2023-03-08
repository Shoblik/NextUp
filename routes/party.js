const express = require('express');
const router = express.Router();
const mysqlCon = require('../utils/database');
const Promise = require('promise');
const PartyModel = require('../models/PartyModel');

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

function getPartiesByBusinessId(businessId, active=1) {
    const queryData = {
        error: null,
        parties: [],
    }

    return new Promise((resolve, reject) => {
        const sql = `
            SELECT * FROM parties 
            WHERE business_id = ${businessId}
            AND active = ${active}
            ORDER BY created_at ASC
        `;

        mysqlCon.query(
            sql,
            (error, results, fields) => {
                if (!error) {
                    Object.keys(results).forEach(function(key) {
                        let row = results[key];
                        queryData.parties.push(row);
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

router.post('/allByBusinessId', (req, res) => {
    const businessId = req.body.businessId;

    getPartiesByBusinessId(businessId).then((queryResult) => {
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(queryResult));
    });
})

// separating models starting down here, will update the above.
// The data object will be passed to the model and finally to a send function via callbacks.
router.post('/remove', (req, res) => {
    const data = {
        partyId: req.body.partyId,
        businessId: req.body.businessId,
        error: null,
        deleted: false,
    }
    
    PartyModel.removeParty(data, res);
})

module.exports = router;