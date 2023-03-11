const mysqlCon = require('../utils/database');

exports.removeParty = (partyId) => {
    return new Promise((resolve, reject) => {
        const sql = `
        UPDATE parties set active = 0 WHERE id = ${partyId}
        `;

        mysqlCon.query(
            sql, 
            (error, results) => {
                if (!error) {
                    resolve(results.affectedRows);
                } else {
                    reject(error)
                }
        });
    })
    
}

exports.addParty = (businessId, name, phone, partySize, data, res) => {
    return new Promise((resolve, reject) => {
        let data = {
            added: false,
            id: null
        }

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

                    resolve(data);
                } else {
                    
                    reject(error);
                }

            }
        )
    });
}

exports.getPartiesByBusinessId = (businessId) => {
    return new Promise((resolve, reject) => {
        const parties = [];

        const sql = `
            SELECT * FROM parties 
            WHERE business_id = ${businessId}
            AND active = 1
            ORDER BY created_at ASC
        `;

        mysqlCon.query(
            sql,
            (error, results) => {
                if (!error) {
                    Object.keys(results).forEach(function(key) {
                        let row = results[key];
                        parties.push(row);
                    });

                    resolve(parties);
                } else {
                    reject(error);
                }
            }
        )
    });
}