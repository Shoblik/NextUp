const express = require('express');
const router = express.Router();
const mysqlCon = require('../utils/database');
const Promise = require('promise');
const PartyModel = require('../models/PartyModel');

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
    const data = {
        error: null,
        added: false,
        id: null
    }

    PartyModel.addParty(req.body.businessId, req.body.name, req.body.phone, req.body.partySize, data, res)
})

router.post('/allByBusinessId', (req, res) => {
    const data = {
        error: null,
        parties: [],
    }

    const businessId = req.body.businessId;

    PartyModel.getPartiesByBusinessId(businessId, 1, data, res);
})

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