require('dotenv').config();
const mysql = require('mysql');

//let connection = mysql.createConnection({
//    host: 'mydb.tamk.fi',
//    user: process.env.user,
//    password: process.env.password,
//    database: process.env.database,
//});

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DB,
});

// Connection functions in separate export
const connection = {
    connect: () => {
        return new Promise((resolve, reject) => {
            db.connect((err) => {
                if (err) reject('DB connection failed.\n' + err);
                else resolve();
            });
        });
    },
    close: () => {
        return new Promise((resolve, reject) => {
            db.end((err) => {
                if (err) reject('DB connection not closed.\n' + err);
                else resolve();
            });
        });
    },
};

const query = {
    // Return the new id if insert succeeded
    save: (location) => {
        return new Promise((resolve, reject) => {
            db.query('insert into locations set ?', location, (err, res) => {
                if (err) reject('Saving to DB failed.\n' + err);
                else resolve(res.insertId);
            });
        });
    },
    // Return an array of location objects, can be empty
    findAll: (params) => {
        return new Promise((resolve, reject) => {
            let order = params.pop() === 'desc' ? 'desc' : 'asc';
            db.query(
                'select * from locations ' +
                    'where latitude between ? and ? ' +
                    'and longitude between ? and ? ' +
                    'order by ?? ' + // Need the ?? to treat as identifier
                    order,
                params,
                (err, res) => {
                    if (err) reject('DB query failed.\n' + err);
                    else resolve(res);
                }
            );
        });
    },
    // Return true if deleted, false if no rows affected
    deleteById: (id) => {
        return new Promise((resolve, reject) => {
            db.query('delete from locations where id = ?', [id], (err, res) => {
                if (err) reject('Deletion failed.\n' + err);
                else resolve(res.affectedRows !== 0);
            });
        });
    },
    // Return a location object, or null if id doesn't exist
    findById: (id) => {
        return new Promise((resolve, reject) => {
            db.query(
                'select * from locations where id = ?',
                [id],
                (err, res) => {
                    if (err) reject('DB query failed.\n' + err);
                    else if (res.length === 0) resolve(null);
                    else resolve(res[0]);
                }
            );
        });
    },
};
module.exports = { connection, query };
