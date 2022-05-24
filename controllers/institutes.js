const connection = require('../utils/connection.js');


//next id of institute
exports.nextId = async (req, res) => {
    try {
        var datetime = new Date();
        console.log("\nInstitute next number by Admin, Time:", datetime.toTimeString());
        const pool = await connection.poolPromise;
        var arr = [];
        await pool.getConnection(async (err, connection) => {
            if (!err) {
                await connection.query("SELECT max_number as next_number FROM id_increment WHERE tablename='institutes'", (error, results, fields) => {
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

//API for registration of institutes by admin
exports.instituteRegistration = async (req, res) => {
    try {
        //getting the data of students
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
                    await connection.query('SELECT max_number FROM id_increment WHERE tablename="institutes"',
                        async (error, results, fields) => {
                            if (error) {
                                return connection.rollback(() => {
                                    throw error;
                                });
                            } else {
                                var next_inst_id = results[0].max_number + 1;
                                console.log("Next Number:" + next_inst_id);
                                await connection.query('INSERT INTO institutes (inst_id, inst_name, inst_address, inst_contact) VALUES(?,?,?,?)',
                                    [next_inst_id, data.inst_name, data.inst_address, data.inst_contact],
                                    async (error, results, fields) => {
                                        if (error) {
                                            return connection.rollback(() => {
                                                res.status(409).send({
                                                    success: false,
                                                    msg: "Institute is already exist"
                                                });
                                            });
                                        } else {
                                            await connection.query('UPDATE id_increment SET max_number=? WHERE tablename="institutes"', [next_inst_id],
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
                                                                msg: "Successfully Registered",
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

//API for get all the details of institutes
exports.getDetails = async (req, res) => {
    try {
        var datetime = new Date();
        console.log("\nInstitutes details by Admin, Time:", datetime.toTimeString());
        const pool = await connection.poolPromise;
        var arr = [];
        await pool.getConnection(async (err, connection) => {
            if (!err) {
                await connection.query('SELECT * FROM institutes', (error, results, fields) => {
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

//API to update the details of institute
exports.updateInstitute = async (req, res) => {
    try {
        var datetime = new Date();
        console.log("\nInstitutes details update by Admin, Time:", datetime.toTimeString());
        //getting the data of students
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
                    await connection.query('UPDATE institutes SET inst_name=?,inst_address=?,inst_contact=? WHERE inst_id=?',
                        [data.inst_name, data.inst_address, data.inst_contact, data.inst_id],
                        async (error, results, fields) => {
                            if (error) {
                                return connection.rollback(() => {
                                    res.status(409).send({
                                        success: false,
                                        msg: "Institute is already exist"
                                    });
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

//API to delete institute details
exports.deleteInstitute = async (req, res) => {
    try {
        var datetime = new Date();
        console.log("\nInstitutes details delete by Admin, Time:", datetime.toTimeString());
        //getting the id of students
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
                    await connection.query('SELECT COUNT(std_id) as count from students WHERE inst_id=?', [data.inst_id],
                        async (error, results, fields) => {
                            var count = JSON.stringify(results[0].count);
                            if (error) {
                                return connection.rollback(() => {
                                    throw error;
                                });
                            } else if (count == 0) {
                                await connection.query('DELETE FROM institutes WHERE inst_id=?', [data.inst_id],
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
                                                    msg: "Successfully Deleted"
                                                });
                                            });
                                        }
                                    });
                            } else {
                                res.status(409).send({
                                    success: false,
                                    msg: "You cannot delete the Institute's details"
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

