const mysqlCon = require('../utils/database');

const sql = `
    CREATE TABLE users (
    id int(11) NOT NULL AUTO_INCREMENT,
    name varchar(90) DEFAULT NULL,
    email varchar(90) DEFAULT NULL,
    password varchar(255) DEFAULT NULL,
    business varchar(90) DEFAULT NULL,
    business_uri varchar(100) DEFAULT NULL,
    phone varchar(90) DEFAULT NULL,
    active tinyint(4) DEFAULT 1,
    updated_at timestamp NULL DEFAULT current_timestamp(),
    created_at timestamp NULL DEFAULT current_timestamp(),
    PRIMARY KEY (id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `;

mysqlCon.query(
    sql,
    (error, results, fields) => {
        if (!error) {
            console.log(results);
        } else {
            console.log(error);
        }
    }
);




