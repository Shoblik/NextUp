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

exports.addParty = (businessId, name, phone, partySize, data, res) => {
    const sql = `
        INSERT INTO parties (business_id, name, phone, party_size, created_at, updated_at)
        VALUES('${businessId}', '${name}', '${phone}', '${partySize}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
        `;
    
    mysqlCon.query(
        sql,
        (error, results) => {
            if (!error) {
                data.id = results.insertId;
                data.added = true;
            } else {
                data.error = error;
            }

            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify(data));
        }
    )
}

exports.getPartiesByBusinessId = (businessId, active, data, res) => {
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
                        data.parties.push(row);
                    });
                } else {
                    data.error = error;
                }

                res.setHeader('Content-Type', 'application/json');
                res.send(JSON.stringify(data));
            }
        )
}