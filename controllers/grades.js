const connection = require('../utils/connection.js');


//next id of grades
exports.nextId = async (req, res) => {
    try {
        var datetime = new Date();
        console.log("\nGrades next number by Admin, Time:", datetime.toTimeString());
        const pool = await connection.poolPromise;
        var arr = [];
        await pool.getConnection(async (err, connection) => {
            if (!err) {
                await connection.query("SELECT max_number as next_number FROM id_increment WHERE tablename='grades'", (error, results, fields) => {
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

//API for registration of grades by admin
exports.gradeRegistration = async (req, res) => {
    try {
        var datetime = new Date();
        console.log("\nGrades registration by Admin, Time:", datetime.toTimeString());
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
                    await connection.query('SELECT max_number FROM id_increment WHERE tablename="grades"',
                        async (error, results, fields) => {
                            if (error) {
                                return connection.rollback(() => {
                                    throw error;
                                });
                            } else {
                                var next_grade_id = results[0].max_number + 1;
                                console.log("Next Number:" + next_grade_id);

                                await connection.query('INSERT INTO grades (grade_id, standard) VALUES(?,?)',
                                    [next_grade_id, data.standard],
                                    async (error, results, fields) => {
                                        if (error) {
                                            return connection.rollback(() => {
                                                res.status(409).send({
                                                    success: false,
                                                    msg: "Grade is already exist"
                                                });
                                            });
                                        } else {
                                            await connection.query('UPDATE id_increment SET max_number=? WHERE tablename="grades"', [next_grade_id],
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
                                                                msg: "Successfully Registered",
                                                            });
                                                            console.log('success!');
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

//API for get all the details of grades
exports.getDetails = async (req, res) => {
    try {
        var datetime = new Date();
        console.log("\nGrades details by Admin, Time:", datetime.toTimeString());
        const pool = await connection.poolPromise;
        var arr = [];
        await pool.getConnection(async (err, connection) => {
            if (!err) {
                await connection.query('SELECT * FROM grades', (error, results, fields) => {
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

//API to update the details of grades
exports.updateGrade = async (req, res) => {
    try {
        var datetime = new Date();
        console.log("\nGrades update by Admin, Time:", datetime.toTimeString());
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
                    await connection.query('UPDATE grades SET standard=? WHERE grade_id=?',
                        [data.standard, data.grade_id],
                        async (error, results, fields) => {
                            if (error) {
                                return connection.rollback(() => {
                                    res.status(409).send({
                                        success: false,
                                        msg: "Grade is already exist"
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

//API to delete grades details
exports.deleteGrade = async (req, res) => {
    try {
        var datetime = new Date();
        console.log("\nGrades delete by Admin, Time:", datetime.toTimeString());
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
                    await connection.query('SELECT COUNT(std_id) as count from students WHERE grade_id=?;', [data.grade_id],
                        async (error, results, fields) => {
                            var count = JSON.stringify(results[0].count);
                            if (error) {
                                return connection.rollback(() => {
                                    throw error;
                                });
                            } else if (count == 0) {
                                await connection.query('DELETE FROM grades WHERE grade_id=?', [data.grade_id],
                                    async (error, results, fields) => {
                                        // var count = JSON.stringify(results[0].count);
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
                                                    msg: "Successfully Deleted"
                                                });
                                            });
                                        }
                                    });
                            } else {
                                res.status(409).send({
                                    success: false,
                                    msg: "You cannot delete the Grade's details"
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

