let jwt = require('jsonwebtoken');
const connection = require('../utils/connection.js');


//POST method for send the message by Student
exports.sendMessage = async (req, res) => {
    try {
        var datetime = new Date();
        console.log("\nSend message by Student, Time:", datetime.toTimeString());

        //getting the id of book
        let data = req.body;
        console.log(data);
        let token = req.headers.token;
        var decodedToken = jwt.decode(token);
        console.log(decodedToken);

        //transaction of data
        const pool = await connection.poolPromise;
        await pool.getConnection(async (err, connection) => {
            if (!err) {
                await connection.beginTransaction(async (err) => {
                    if (err) {
                        throw err;
                    }
                    await connection.query('SELECT max_number from id_increment WHERE tablename="messages"',
                        async (error, results, fields) => {
                            var next_number = results[0].max_number + 1;
                            if (error) {
                                return connection.rollback(() => {
                                    throw error;
                                });
                            } else {
                                await connection.query('SELECT sv_id from students WHERE std_id=?', [decodedToken.std_id],
                                    async (error, results, fields) => {
                                        var sv_id = results[0].sv_id;
                                        if (error) {
                                            return connection.rollback(() => {
                                                throw error;
                                            });
                                        } else {
                                            await connection.query('INSERT into supervisor_inbox(message_id,message,sv_id,std_id) VALUES(?,?,?,?)', [next_number, data.message, sv_id, decodedToken.std_id],
                                                async (error, results, fields) => {

                                                    if (error) {
                                                        return connection.rollback(() => {
                                                            throw error;
                                                        });
                                                    } else {
                                                        await connection.query('UPDATE id_increment SET max_number=? WHERE tablename="messages"', [next_number],
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
                                                                        res.status(201).send({
                                                                            success: true,
                                                                            msg: "Successfully Send"
                                                                        });
                                                                    });
                                                                }
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

//GET method for get all the messages of students
exports.receiveMessage = async (req, res) => {
    try {
        var datetime = new Date();
        console.log("\nMessage details by Supervisor, Time:", datetime.toTimeString());
        let token = req.headers.token;
        var decodedToken = jwt.decode(token);
        console.log(decodedToken);

        const pool = await connection.poolPromise;
        var arr = [];
        await pool.getConnection(async (err, connection) => {
            if (!err) {
                await connection.query("SELECT M.*,STD.std_name,STD.std_gender,STD.std_address FROM supervisor_inbox M JOIN students STD on M.std_id=STD.std_id WHERE M.sv_id=?",
                    [decodedToken.sv_id], (error, results, fields) => {
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

//POST method for delete message by supervisor
exports.deleteMessage = async (req, res) => {
    try {
        var datetime = new Date();
        console.log("\nMessage delete by Supervisor, Time:", datetime.toTimeString());

        //getting the id of students
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
                    await connection.query('DELETE FROM supervisor_inbox WHERE message_id=?', [data.message_id],
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
                                    res.status(201).send({
                                        success: true,
                                        msg: "Successfully Deleted"
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
