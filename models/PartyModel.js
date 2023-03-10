const mysqlCon = require('../utils/database');

exports.removeParty = (data, res) => {
    const sql = `
            UPDATE parties set active = 0 WHERE id = ${data.partyId}
        `;

    mysqlCon.query(
        sql, 
        (error, results) => {
            if (!error) {
                data.deleted = true;
            } else {
                console.log(error);
            }
        
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify(data));
    });
}
