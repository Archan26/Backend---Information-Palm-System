const connection = require('../utils/connection.js');




//API for get all the details of supervisors 
exports.getDetails = async (req, res) => {
    try {
        var datetime = new Date();
        console.log("\nSupervisor Details by Admin, Time:", datetime.toTimeString());
        const pool = await connection.poolPromise;
        var arr = [];
        await pool.getConnection(async (err, connection) => {
            if (!err) {
                await connection.query('SELECT * FROM supervisors', (error, results, fields) => {
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
                    // console.log("Array", arr);
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

//API for get all the details of verified supervisors 
exports.getVerifiedDetails = async (req, res) => {
    try {
        var datetime = new Date();
        console.log("\nVerified Supervisor Details by Admin, Time:", datetime.toTimeString());
        const pool = await connection.poolPromise;
        var arr = [];
        await pool.getConnection(async (err, connection) => {
            if (!err) {
                await connection.query('SELECT sv_id,sv_name FROM supervisors WHERE sv_status=1', (error, results, fields) => {
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

//API to transfer the all students from one supervisor to another verified supervisor
exports.transfer = async (req, res) => {
    try {
        var datetime = new Date();
        //getting the data of supervisor id //from: to to:
        console.log("\nSupervisors Transfer by Admin, Time:", datetime.toTimeString());
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
                    await connection.query('SELECT no_students FROM supervisors WHERE sv_id=?', [data.from],
                        async (error, results, fields) => {
                            if (error) {
                                return connection.rollback(() => {
                                    throw error;
                                });
                            } else {
                                var from = results[0].no_students;
                                console.log("FROM: " + from)
                                await connection.query('UPDATE supervisors SET no_students=no_students+? WHERE sv_id=?', [from, data.to],
                                    async (error, results, fields) => {
                                        if (error) {
                                            return connection.rollback(() => {
                                                throw error;
                                            });
                                        } else {
                                            await connection.query('UPDATE device_info SET sv_id=? WHERE sv_id=?', [data.to, data.from],
                                                async (error, results, fields) => {
                                                    if (error) {
                                                        return connection.rollback(() => {
                                                            throw error;
                                                        });
                                                    } else {
                                                        await connection.query('UPDATE supervisor_inbox SET sv_id=? WHERE sv_id=?', [data.to, data.from],
                                                            async (error, results, fields) => {
                                                                if (error) {
                                                                    return connection.rollback(() => {
                                                                        throw error;
                                                                    });
                                                                } else {
                                                                    await connection.query('UPDATE students SET sv_id=? WHERE sv_id=?', [data.to, data.from],
                                                                        async (error, results, fields) => {
                                                                            if (error) {
                                                                                return connection.rollback(() => {
                                                                                    throw error;
                                                                                });
                                                                            } else {
                                                                                var affectedRows = results.affectedRows
                                                                                await connection.query('UPDATE supervisors SET no_students=0 WHERE sv_id=?', [data.from],
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
                                                                                                    msg: "Successfully Transfer",
                                                                                                    affectedRows: affectedRows
                                                                                                });
                                                                                            });
                                                                                        }
                                                                                    });
                                                                            }
                                                                        });
                                                                }
                                                            })
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

//API for supervisor verification 
exports.verification = async (req, res) => {
    try {
        var datetime = new Date();
        console.log("\nVerification Supervisor by Admin, Time:", datetime.toTimeString());
        //getting the data of supervisor id //from: to to:
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
                    await connection.query('UPDATE supervisors SET sv_status=? WHERE sv_id=?', [data.sv_status, data.sv_id],
                        async (error, results, fields) => {
                            if (error) {
                                return connection.rollback(() => {
                                    throw error;
                                });
                            } else {
                                console.log(JSON.stringify(results.affectedRows));
                                connection.commit((err) => {
                                    if (err) {
                                        return connection.rollback(() => {
                                            throw err;
                                        });
                                    }
                                    if (data.sv_status === true) {
                                        res.status(201).send({
                                            success: true,
                                            msg: "Successfully Verified",
                                        });
                                    } else {
                                        res.status(201).send({
                                            success: true,
                                            msg: "Successfully Unverified",
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

//API to delete supervisors details
//In this first it will count no. of students under particular supervisor, 
//if it is 0 then details can be delete else not
exports.deleteSupervisor = async (req, res) => {
    try {
        var datetime = new Date();
        console.log("\nDelete Supervisor Detail by Admin, Time:", datetime.toTimeString());
        //getting the data of supervisor id //from: to to:
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
                    await connection.query('SELECT COUNT(std_id) as count FROM students WHERE sv_id=?', [data.sv_id],
                        async (error, results, fields) => {
                            var count = JSON.stringify(results[0].count);
                            if (error) {
                                return connection.rollback(() => {
                                    throw error;
                                });
                            } else if (count == 0) {
                                console.log(JSON.stringify(results[0].count));
                                await connection.query('DELETE FROM supervisor_login WHERE sv_id=?', [data.sv_id],
                                    async (error, results, fields) => {
                                        if (error) {
                                            return connection.rollback(() => {
                                                throw error;
                                            });
                                        } else {
                                            await connection.query('DELETE FROM supervisors WHERE sv_id=?', [data.sv_id],
                                                async (error, results, fields) => {
                                                    if (error) {
                                                        return connection.rollback(() => {
                                                            throw error;
                                                        });
                                                    } else {
                                                        console.log(JSON.stringify(results.affectedRows));
                                                        connection.commit((err) => {
                                                            if (err) {
                                                                return connection.rollback(() => {
                                                                    throw err;
                                                                });
                                                            }
                                                            res.status(201).send({
                                                                success: true,
                                                                msg: "Successfully Deleted",
                                                                affectedRows: results.affectedRows
                                                            });
                                                        });
                                                    }
                                                });
                                        }
                                    });
                            } else {
                                res.status(409).send({
                                    success: false,
                                    msg: "You cannot delete the Supervisor's details"
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

