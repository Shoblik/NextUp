const express = require('express');
const router = express.Router();
const mysqlCon = require('../utils/database');
const Promise = require('promise');
const PartyModel = require('../models/PartyModel');

router.post('/add', (req, res) => {
    const data = {
        error: null,
        added: false,
        id: null
    }

    PartyModel.addParty(req.body.businessId, req.body.name, req.body.phone, req.body.partySize, data, res).then(queryData => {
        data.added = queryData.added;
        data.id = queryData.id;

        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(data));
    }).catch(error => {
        data.error = true;
        console.log(error)


        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(data));
        // do some error logging
    })
})

router.post('/allByBusinessId', (req, res) => {
    const data = {
        error: null,
        parties: [],
    }

    res.setHeader('Content-Type', 'application/json');


    PartyModel.getPartiesByBusinessId(req.body.businessId).then((parties) => {
        data.parties = parties;

        res.send(JSON.stringify(data));
    }).catch((error) => {
        data.error = true;

        res.send(JSON.stringify(data));
        
        console.log(error);

        // do some logging
    });
})

router.post('/remove', (req, res) => {
    const data = {
        partyId: req.body.partyId,
        businessId: req.body.businessId,
        error: null,
        deleted: false,
    }

    res.setHeader('Content-Type', 'application/json');
    
    PartyModel.removeParty(data.partyId).then(affectedRows => {

        data.deleted = affectedRows === 1 ? true : false;
        
        res.send(JSON.stringify(data));
    }).catch(error => {
        data.error = true;
        
        res.send(JSON.stringify(data));
        console.log(error);

        // do some logging
    });
})

module.exports = router;