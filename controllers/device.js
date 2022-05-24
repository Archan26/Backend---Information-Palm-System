let jwt = require('jsonwebtoken');
const connection = require('../utils/connection.js');


//for admin
//next id of device
exports.nextId = async (req, res) => {
    try {
        var datetime = new Date();
        console.log("\nDevice next number by Admin, Time:", datetime.toTimeString());
        const pool = await connection.poolPromise;
        var arr = [];
        await pool.getConnection(async (err, connection) => {
            if (!err) {
                await connection.query("SELECT max_number as next_number FROM id_increment WHERE tablename='device'", (error, results, fields) => {
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

//details for reg, update
exports.getCommon = async (req, res) => {
    try {
        var datetime = new Date();
        console.log("\nDevice common by Admin, Time:", datetime.toTimeString());
        const pool = await connection.poolPromise;
        var arr = [];
        await pool.getConnection(async (err, connection) => {
            if (!err) {
                await connection.query("SELECT sv_id,sv_name from supervisors WHERE sv_status=1", (error, results, fields) => {
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

//device registration by admin
exports.deviceRegistration = async (req, res) => {
    try {
        var datetime = new Date();
        console.log("\nDevice Registration by Admin, Time:", datetime.toTimeString());
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
                    await connection.query('SELECT max_number FROM id_increment WHERE tablename="device"',
                        async (error, results, fields) => {
                            if (error) {
                                return connection.rollback(() => {
                                    throw error;
                                });
                            } else {
                                var next_device_id = results[0].max_number + 1;
                                console.log("Next Device id:" + next_device_id)
                                await connection.query('INSERT INTO device_info (device_id, unique_id, sv_id) VALUES(?,?,?)',
                                    [next_device_id, data.unique_id, data.sv_id],
                                    async (error, results, fields) => {
                                        if (error) {
                                            return connection.rollback(() => {
                                                res.status(409).send({
                                                    success: false,
                                                    msg: "Unique ID is already exist"
                                                });
                                            });
                                        } else {
                                            await connection.query('UPDATE id_increment SET max_number=? WHERE tablename="device"',
                                                [next_device_id],
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
                                                                msg: "Successfully Registered"
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

//API for get all details of device  
exports.getDetails = async (req, res) => {
    try {
        var datetime = new Date();
        console.log("\nDevice details by Admin, Time:", datetime.toTimeString());
        let token = req.headers.token;
        var forKey = jwt.decode(token);
        console.log(forKey);
        const pool = await connection.poolPromise;
        var arr = [];
        var temp = [];
        await pool.getConnection(async (err, connection) => {
            if (!err) {
                await connection.query('SELECT D.*, S.sv_name FROM device_info D JOIN supervisors S ON D.sv_id=S.sv_id order by D.device_id;SELECT STD.std_id,STD.std_name,STD.std_gender,STD.std_address,STD.std_contact,STD.std_birthdate,STD.grade_id,D.device_id from students STD join device_info D on STD.device_id = D.device_id order by STD.device_id;',
                    (error, results, fields) => {
                        if (error) {
                            console.log(error);
                            throw error
                        };
                        results = JSON.stringify(results);
                        results = JSON.parse(results);
                        // console.log(results[0].length);
                        results.forEach(element => {
                            arr.push(element)
                        });
                        // console.log(results[1][0].std_id);
                        for (let i = 0, j = 0; i < results[0].length; i++) {
                            // console.log("i: ", i);
                            // console.log("j: ", j);
                            if (results[0][i].device_status == 1) {
                                // console.log("In if");
                                var data = {
                                    device_id: results[0][i].device_id,
                                    // device_id_std: results[1][j].device_id,
                                    unique_id: results[0][i].unique_id,
                                    device_status: results[0][i].device_status,
                                    sv_id: results[0][i].sv_id,
                                    sv_name: results[0][i].sv_name,
                                    std_id: results[1][j].std_id,
                                    std_name: results[1][j].std_name,
                                    std_gender: results[1][j].std_gender,
                                    std_address: results[1][j].std_address,
                                    std_contact: results[1][j].std_contact,
                                    std_birthdate: results[1][j].std_birthdate,
                                    grade_id: results[1][j].grade_id
                                }
                                j++;
                                temp.push(data);
                            } else {
                                // console.log("In else");
                                var data = {
                                    device_id: results[0][i].device_id,
                                    unique_id: results[0][i].unique_id,
                                    device_status: results[0][i].device_status,
                                    sv_id: results[0][i].sv_id,
                                    sv_name: results[0][i].sv_name
                                }
                                temp.push(data);
                            }
                        }
                        // console.log("Temp: ", temp);
                        res.status(200).send(temp);
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

//device update by admin (assign supervisor)
exports.updateDevice = async (req, res) => {
    try {
        var datetime = new Date();
        console.log("\nDevice details update by Admin, Time:", datetime.toTimeString());
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
                    await connection.query('SELECT device_status FROM device_info WHERE device_id=?', [data.device_id],
                        async (error, results, fields) => {
                            var device_status = results[0].device_status;
                            if (error) {
                                return connection.rollback(() => {
                                    throw error;
                                });
                            } else if (device_status === 0) {
                                await connection.query('UPDATE device_info SET unique_id=?,sv_id=? WHERE device_id=?',
                                    [data.unique_id, data.sv_id, data.device_id],
                                    async (error, results, fields) => {
                                        if (error) {
                                            return connection.rollback(() => {
                                                res.status(409).send({
                                                    success: false,
                                                    msg: "Unique ID is already exist"
                                                });
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
                                                    msg: "Successfully Updated"
                                                });
                                            });
                                        }
                                    });
                            } else {
                                res.status(401).send({
                                    success: false,
                                    msg: "Please Un-Assign the device from student"
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



//for supervisors

exports.getCommonDetails = async (req, res) => {
    try {
        var datetime = new Date();
        console.log("\nCommon details by Supervisor, Time:", datetime.toTimeString());
        let token = req.headers.token;
        var forKey = jwt.decode(token);
        console.log(forKey);
        const pool = await connection.poolPromise;
        var arr = [];
        await pool.getConnection(async (err, connection) => {
            if (!err) {
                await connection.query('SELECT * from students WHERE sv_id=? and device_id IS null;', [forKey.sv_id], (error, results, fields) => {
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

exports.getDeviceDetails = async (req, res) => {
    try {
        var datetime = new Date();
        console.log("\nDevice Details details by Supervisor, Time:", datetime.toTimeString());
        let token = req.headers.token;
        var forKey = jwt.decode(token);
        console.log(forKey);
        const pool = await connection.poolPromise;
        var arr = [];
        var temp = [];
        await pool.getConnection(async (err, connection) => {
            if (!err) {
                await connection.query('SELECT * from device_info WHERE sv_id=?;SELECT * from students WHERE sv_id=? and device_id IS not null order by device_id', [forKey.sv_id, forKey.sv_id], (error, results, fields) => {
                    if (error) {
                        console.log(error);
                        throw error
                    };
                    results = JSON.stringify(results);
                    results = JSON.parse(results);
                    results.forEach(element => {
                        arr.push(element)
                    });

                    for (let i = 0, j = 0; i < results[0].length; i++) {
                        // console.log("i: ", i);
                        // console.log("j: ", j);
                        if (results[0][i].device_status == 1) {
                            // console.log("In if");
                            var data = {
                                device_id: results[0][i].device_id,
                                // device_id_std: results[1][j].device_id,
                                unique_id: results[0][i].unique_id,
                                device_status: results[0][i].device_status,
                                sv_id: results[0][i].sv_id,
                                std_id: results[1][j].std_id,
                                std_name: results[1][j].std_name,
                                std_gender: results[1][j].std_gender,
                                std_address: results[1][j].std_address,
                                std_contact: results[1][j].std_contact,
                                std_birthdate: results[1][j].std_birthdate,
                                grade_id: results[1][j].grade_id
                            }
                            j++;
                            temp.push(data);
                        } else {
                            // console.log("In else");
                            var data = {
                                device_id: results[0][i].device_id,
                                unique_id: results[0][i].unique_id,
                                device_status: results[0][i].device_status,
                                sv_id: results[0][i].sv_id,
                            }
                            temp.push(data);
                        }
                    }
                    // console.log(arr);
                    res.status(200).send(temp);
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

//device assign by supervisor
exports.assignDevice = async (req, res) => {
    try {
        var datetime = new Date();
        console.log("\nassignDevice to student by Supervisor, Time:", datetime.toTimeString());
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
                    await connection.query('UPDATE students SET device_id=? WHERE std_id=?', [data.device_id, data.std_id],
                        async (error, results, fields) => {
                            if (error) {
                                return connection.rollback(() => {
                                    throw error;
                                });
                            } else {
                                await connection.query('UPDATE device_info SET device_status=1 WHERE device_id=?', [data.device_id],
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
                                                    msg: "Successfully Assigned"
                                                });
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

//device assign by supervisor
exports.unassignDevice = async (req, res) => {
    try {
        var datetime = new Date();
        console.log("\nunAssignDevice from students by Supervisor, Time:", datetime.toTimeString());
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
                    await connection.query('UPDATE students SET device_id=NULL WHERE std_id=?', [data.std_id],
                        async (error, results, fields) => {
                            if (error) {
                                return connection.rollback(() => {
                                    throw error;
                                });
                            } else {
                                await connection.query('UPDATE device_info SET device_status=0 WHERE device_id=?', [data.device_id],
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
                                                    msg: "Successfully Un-Assign"
                                                });
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
