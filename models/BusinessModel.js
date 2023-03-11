const mysqlCon = require('../utils/database');

exports.getBusinessDetailsFromUri = (businessUri) => {
    return new Promise((resolve, reject) => {
        const sql = `
            SELECT * FROM business 
            WHERE business_uri = '${businessUri}' 
            LIMIT 1;
        `;

        mysqlCon.query(
            sql, 
            (error, results) => {
                if (!error) {
                    resolve(results);
                } else {

                    reject(error);
                }
        });
    });
    

    
}

exports.businessSignUp = (name, email, business, businessUri) => {
    return new Promise((resolve, reject) => {
        let results = {};

        const sql = `
        INSERT INTO business (name, email, business, business_uri, updated_at, created_at)
        VALUES('${name}','${email}','${business}', '${businessUri}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
        `;
    
        mysqlCon.query(
            sql,
            (error, results, fields) => {
                if (!error) {
                    results.businessUri = businessUri;
                    results.user = true;
                    results.id = results.insertId;

                    resolve(results);
                } else {
                
                    reject(error);
                }
            }
        )
    });


    
}