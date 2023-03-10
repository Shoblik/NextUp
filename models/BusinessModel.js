const mysqlCon = require('../utils/database');

exports.getBusinessDetailsFromUri = (businessUri, data, res) => {
    const sql = `
            SELECT * FROM business 
            WHERE business_uri = '${businessUri}' 
            LIMIT 1;
        `;

    mysqlCon.query(
        sql, 
        (error, results) => {
            if (!error) {
                Object.keys(results).forEach(function(key) {
                    let row = results[key];
                    data.results.push(row);
                });
            } else {
                data.error = error;
            }

            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify(data));
    });
}

exports.businessSignUp = (name, email, business, businessUri, data, res) => {
    const sql = `
    INSERT INTO business (name, email, business, business_uri, updated_at, created_at)
    VALUES('${name}','${email}','${business}', '${businessUri}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
    `;

    mysqlCon.query(
        sql,
        (error, results, fields) => {
            if (!error) {
                data['businessUri'] = businessUri;
                data['user'] = true;
                data['id'] = results.insertId;
            } else {
                data['errors'] = error;
                data['user'] = false;
            }

            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify(data));
        }
    )
}