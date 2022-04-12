require('dotenv').config();
const mysql = require('mysql');

const pool = mysql.createPool({
    host: 'mydb.tamk.fi',
    user: process.env.user,
    password: process.env.password,
    database: process.env.database,
    connectionLimit: 10,
});

module.exports = {
    // Return the new id if insert succeeded
    save: (location) => {
        return new Promise((resolve, reject) => {
            pool.query('insert into locations set ?', location, (err, res) => {
                if (err) reject('Saving to DB failed.\n' + err);
                else resolve(res.insertId);
            });
        });
    },
    // Return an array of location objects, can be empty
    findAll: (params) => {
        return new Promise((resolve, reject) => {
            let order = params.pop() === 'desc' ? 'desc' : 'asc';
            pool.query(
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
            pool.query('delete from locations where id = ?', [id], (err, res) => {
                if (err) reject('Deletion failed.\n' + err);
                else resolve(res.affectedRows !== 0);
            });
        });
    },
    // Return a location object, or null if id doesn't exist
    findById: (id) => {
        return new Promise((resolve, reject) => {
            pool.query(
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
