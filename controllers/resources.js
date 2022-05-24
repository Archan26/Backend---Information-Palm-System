const connection = require('../utils/connection.js');
let jwt = require('jsonwebtoken');


//GET method for get all the details of books
exports.getDetails = async (req, res) => {
    try {
        var datetime = new Date();
        console.log("\nStudent-Books Details, Time:", datetime.toTimeString());
        let token = req.headers.token;
        var decodedToken = jwt.decode(token);
        console.log(decodedToken);

        const pool = await connection.poolPromise;
        var arr = [];
        await pool.getConnection(async (err, connection) => {
            if (!err) {
                await connection.query("SELECT B.* from books B join grades G on B.grade_id=G.grade_id and G.level_id=(SELECT level_id from grades where grade_id=(SELECT grade_id from students WHERE std_id=2))",
                    (error, results, fields) => {
                        if (error) {
                            console.log(error);
                            throw error
                        };
                        results = JSON.stringify(results);
                        results = JSON.parse(results);
                        results.forEach(element => {
                            arr.push(element)
                        });
                        // console.log(arr);
                        res.status(200).send(arr);
                    });
                connection.release();
            } else {
                console.log("Failed to connect with database");
                res.status(500).send({
                    success: false,
                    msg: "Internal Server Error",
                });
            }
        });
    } catch (err) {
        console.log(err);
        res.status(500).send({
            success: false,
            msg: "Internal Server Error",
        });
    }
};

var book_name = "";
//POST method for book view by Student
exports.requestFile = async (req, res) => {

    try {
        var datetime = new Date();
        console.log("\nStudent-Books details view by Student, Time:", datetime.toTimeString());

        //getting the id of book
        let data = req.body;
        console.log(data);

        //transaction of data
        const pool = await connection.poolPromise;
        await pool.getConnection(async (err, connection) => {
            if (!err) {
                await connection.beginTransaction(async (err) => {
                    if (err) {
                        throw err;
                    }
                    await connection.query('SELECT book_name FROM books WHERE book_id=?', [data.book_id],
                        async (error, results, fields) => {
                            // var count = JSON.stringify(results[0].count);
                            if (error) {
                                return connection.rollback(() => {
                                    throw error;
                                });
                            } else {
                                book_name = results[0].book_name;
                                res.status(200).send({
                                    success: true,
                                    msg: "Successfully Get File"
                                });
                            }
                        });
                });
                connection.release();
            } else {
                console.log("Failed to connect with database");
                res.status(500).send({
                    success: false,
                    msg: "Internal Server Error",
                });
            }
        });
    } catch (err) {
        res.status(500).send({
            success: false,
            msg: "Internal Server Error",
        });
    }
};

//GET method for requested file for view
exports.getFile = async (req, res) => {
    try {
        var datetime = new Date();
        console.log("\nBook View by Student, Time:", datetime.toTimeString());
        console.log(book_name);
        // console.log(`${__dirname}`);
        res.sendFile(`${__dirname}/uploads/` + book_name);
    } catch (err) {
        console.log(err);
        res.status(500).send({
            success: false,
            msg: "Internal Server Error",
        });
    }
};
