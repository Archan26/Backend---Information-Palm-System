const multer = require("multer");
const fs = require('fs');
const connection = require('../utils/connection.js');


//Function for file storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/")
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    },
});
const uploadStorage = multer({ storage: storage });


exports.fileCheck = async (req, res) => {
    try {
        var datetime = new Date();
        console.log("\nBooks Check by Admin, Time:", datetime.toTimeString());

        //getting the data of books
        let data = req.body;
        console.log(data);

        //transaction of data in database
        const pool = await connection.poolPromise;
        await pool.getConnection(async (err, connection) => {
            if (!err) {
                await connection.beginTransaction(async (err) => {
                    if (err) {
                        throw err;
                    }
                    await connection.query('SELECT book_name FROM books WHERE book_name=?',
                        [data.book_name],
                        async (error, results, fields) => {
                            if (error) {
                                return connection.rollback(() => {
                                    throw error;
                                });
                            } else if (results.length == 0) {
                                // console.log(JSON.stringify(results.affectedRows));
                                res.status(200).send({
                                    success: true
                                });
                            } else {
                                res.status(406).send({
                                    success: false,
                                    msg: "File already exist"
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

//POST method for upload the single file and enter the data in database of books
exports.uploadFile = async (req, res) => {
    try {
        //getting the data of books
        let data = req.body;
        console.log(data);
        console.log("File:", req.file);
        var fileName = req.file.filename;

        //transaction of data in database
        const pool = await connection.poolPromise;
        await pool.getConnection(async (err, connection) => {
            if (!err) {
                await connection.beginTransaction(async (err) => {
                    if (err) {
                        throw err;
                    }
                    await connection.query('SELECT max_number FROM id_increment WHERE tablename="books"',
                        async (error, results, fields) => {
                            if (error) {
                                return connection.rollback(() => {
                                    throw error;
                                });
                            } else {
                                var next_book_id = results[0].max_number + 1;
                                await connection.query('INSERT INTO books (book_id, book_name, book_author, cat_id, grade_id) VALUES(?,?,?,?,?)',
                                    [next_book_id, fileName, data.book_author, data.cat_id, data.grade_id],
                                    async (error, results, fields) => {
                                        if (error) {
                                            return connection.rollback(() => {
                                                throw error;
                                            });
                                        } else {
                                            await connection.query('UPDATE id_increment SET max_number=? WHERE tablename="books"', [next_book_id],
                                                async (error, results, fields) => {
                                                    if (error) {
                                                        return connection.rollback(() => {
                                                            throw error;
                                                        });
                                                    } else {
                                                        connection.commit((err) => {
                                                            if (err) {
                                                                return connection.rollback(() => {
                                                                    throw err;
                                                                });
                                                            }
                                                            console.log('success!');
                                                            res.status(201).send({
                                                                success: true,
                                                                msg: "Successfully Added",
                                                            });
                                                        });
                                                    }
                                                });
                                        }
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

//GET method for next id of book
exports.nextId = async (req, res) => {
    try {
        var datetime = new Date();
        console.log("\nBook next number by Admin, Time:", datetime.toTimeString());

        const pool = await connection.poolPromise;
        var arr = [];
        await pool.getConnection(async (err, connection) => {
            if (!err) {
                await connection.query("SELECT max_number as next_number FROM id_increment WHERE tablename='books'", (error, results, fields) => {
                    if (error) {
                        console.log(error);
                        throw error
                    };
                    results = JSON.stringify(results);
                    results = JSON.parse(results);
                    results.forEach(element => {
                        arr.push(element)
                    });
                    arr[0].next_number = arr[0].next_number + 1;
                    console.log(arr);
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
        res.status(500).send({
            success: false,
            msg: "Internal Server Error",
        });
    }
};

//GET method, will used in dropdown in registration and update form 
exports.getCommon = async (req, res) => {
    try {
        var datetime = new Date();
        console.log("\nBooks common by Admin, Time:", datetime.toTimeString());

        const pool = await connection.poolPromise;
        var arr = [];
        await pool.getConnection(async (err, connection) => {
            if (!err) {
                await connection.query("SELECT * from categories; SELECT * from grades;", (error, results, fields) => {
                    if (error) {
                        console.log(error);
                        throw error
                    };
                    results = JSON.stringify(results);
                    results = JSON.parse(results);
                    results.forEach(element => {
                        arr.push(element)
                    });
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
        res.status(500).send({
            success: false,
            msg: "Internal Server Error",
        });
    }
};

//GET method for get all the details of books
exports.bookDetails = async (req, res) => {
    try {
        var datetime = new Date();
        console.log("\nBooks details by Admin, Time:", datetime.toTimeString());

        const pool = await connection.poolPromise;
        var arr = [];
        await pool.getConnection(async (err, connection) => {
            if (!err) {
                await connection.query('SELECT B.*,C.cat_name,G.standard  FROM books B JOIN categories C ON B.cat_id = C.cat_id JOIN grades G ON B.grade_id=G.grade_id', (error, results, fields) => {
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
        res.status(500).send({
            success: false,
            msg: "Internal Server Error",
        });
    }
};

//POST method for update the details of books by admin
exports.updateBooks = async (req, res) => {
    try {
        var datetime = new Date();
        console.log("\nBooks details update by Admin, Time:", datetime.toTimeString());

        //getting the data of books
        let data = req.body;
        console.log(data);

        //transaction of data in database
        const pool = await connection.poolPromise;
        await pool.getConnection(async (err, connection) => {
            if (!err) {
                await connection.beginTransaction(async (err) => {
                    if (err) {
                        throw err;
                    }
                    await connection.query('UPDATE books SET book_name=?,book_author=?,cat_id=?,grade_id=? WHERE book_id=?',
                        [data.book_name, data.book_author, data.cat_id, data.grade_id, data.book_id],
                        async (error, results, fields) => {
                            if (error) {
                                return connection.rollback(() => {
                                    throw error;
                                });
                            } else {
                                // console.log(JSON.stringify(results.affectedRows));
                                connection.commit((err) => {
                                    if (err) {
                                        return connection.rollback(() => {
                                            throw err;
                                        });
                                    }
                                    res.status(201).send({
                                        success: true,
                                        msg: "Successfully Updated"
                                    });
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

//POST method for delete books details by admin
exports.deleteBooks = async (req, res) => {
    try {
        var datetime = new Date();
        console.log("\nBooks details delete by Admin, Time:", datetime.toTimeString());

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
                                console.log(results);
                                var book_name = results[0].book_name;
                                await connection.query('DELETE FROM books WHERE book_id=?', [data.book_id],
                                    async (error, results, fields) => {
                                        // var count = JSON.stringify(results[0].count);
                                        if (error) {
                                            return connection.rollback(() => {
                                                throw error;
                                            });
                                        } else {
                                            connection.commit((err) => {
                                                if (err) {
                                                    return connection.rollback(() => {
                                                        throw err;
                                                    });
                                                }
                                                const path = 'uploads/' + book_name;
                                                fs.unlink(path, (err) => {
                                                    if (err) {
                                                        console.error(err)
                                                        return
                                                    } else {
                                                        res.status(201).send({
                                                            success: true,
                                                            msg: "Successfully Deleted"
                                                        });
                                                    }
                                                })
                                            });
                                        }
                                    })
                                // console.log(JSON.stringify(results.affectedRows));

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

var book_name = "";
//POST method for book view by admin
exports.requestFile = async (req, res) => {
    try {
        var datetime = new Date();
        console.log("\nBooks details view by Admin, Time:", datetime.toTimeString());

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
        console.log("\nBook View by Admin, Time:", datetime.toTimeString());
        // console.log(book_name);
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

