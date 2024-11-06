bdd = require("./bdd.js");

async function getAllUsers() {
    sql = "SELECT * FROM utilisateur";
    return new Promise(function (resolve, reject) {
        bdd.query(sql, function (err, results) {
            if (err) {
                return reject(err);
            }
            resolve(results);
        });
    });
};

async function checkLogin(login) {
    sql = "SELECT * FROM utilisateur WHERE login = ?";
    return new Promise(function (resolve, reject) {
        bdd.query(sql, login, function (err, results) {
            if (err) {
                return reject(err);
            }
            if (results.length > 0) {
                resolve(results[0]);
            }
            else {
                resolve(false);
            }
        });
    });
};

module.exports = { getAllUsers, checkLogin };

