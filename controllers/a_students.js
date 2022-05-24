const bcrypt = require('bcrypt');
const connection = require('../utils/connection.js');


//GET method for next id of student
exports.nextId = async (req, res, next) => {
    try {
        var datetime = new Date();
        console.log("\nStudent next number by Admin, Time:", datetime.toTimeString());

        const pool = await connection.poolPromise;
        var arr = [];
        await pool.getConnection(async (err, connection) => {
            if (!err) {
                await connection.query("SELECT max_number as next_number FROM id_increment WHERE tablename='students'", (error, results, fields) => {
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
exports.getCommon = async (req, res, next) => {
    try {
        var datetime = new Date();
        console.log("\nStudent common by Admin, Time:", datetime.toTimeString());
        const pool = await connection.poolPromise;
        var arr = [];
        await pool.getConnection(async (err, connection) => {
            if (!err) {
                await connection.query("SELECT sv_id,sv_name FROM supervisors WHERE sv_status=1; SELECT * from institutes; SELECT * from grades;", (error, results, fields) => {
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

//POST method for registration of students by admin
exports.postRegistration = async (req, res, next) => {
    try {
        var datetime = new Date();
        console.log("\nStudent registration by Admin, Time:", datetime.toTimeString());

        //getting the data of students
        let data = req.body;
        console.log(data);

        var birthdate = data.std_birthdate.split('T')[0];
        // console.log(birthdate);
        //transaction of data in database
        const pool = await connection.poolPromise;
        await pool.getConnection(async (err, connection) => {
            if (!err) {
                await connection.beginTransaction(async (err) => {
                    if (err) {
                        throw err;
                    }
                    await connection.query('SELECT max_number FROM id_increment WHERE tablename="students"',
                        async (error, results, fields) => {
                            if (error) {
                                return connection.rollback(() => {
                                    throw error;
                                });
                            } else {
                                var next_std_id = results[0].max_number + 1;
                                console.log("Next Number:" + next_std_id);
                                await connection.query('INSERT INTO students (std_id, std_name, std_gender, std_address, std_contact, std_birthdate, sv_id, inst_id, grade_id) VALUES(?,?,?,?,?,?,?,?,?)',
                                    [next_std_id, data.std_name, data.std_gender, data.std_address, data.std_contact, birthdate, data.sv_id, data.inst_id, data.grade_id],
                                    async (error, results, fields) => {
                                        if (error) {
                                            return connection.rollback(() => {
                                                throw error;
                                            });
                                        } else {

                                            var unique = '';
                                            var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
                                            var charactersLength = characters.length;
                                            for (var i = 0; i < 4; i++) {
                                                unique += characters.charAt(Math.floor(Math.random() * charactersLength));
                                            }
                                            console.log(unique);

                                            var username = data.std_name;
                                            username = username.replace(/\s+/g, '').toLowerCase();
                                            console.log("username: " + username);
                                            hashedPassword = await bcrypt.hash(username, 10)
                                            console.log("Hash : ", hashedPassword);
                                            username = username + "." + unique;
                                            console.log("username: " + username);

                                            await connection.query('INSERT INTO student_login (username,password,std_id) VALUES(?,?,?)',
                                                [username, hashedPassword, next_std_id],
                                                async (error, results, fields) => {
                                                    if (error) {
                                                        return connection.rollback(() => {
                                                            throw error;
                                                        });
                                                    } else {
                                                        await connection.query('UPDATE supervisors SET no_students=no_students+1 WHERE sv_id=?', [data.sv_id],
                                                            async (error, results, fields) => {
                                                                if (error) {
                                                                    return connection.rollback(() => {
                                                                        throw error;
                                                                    });
                                                                } else {
                                                                    await connection.query('UPDATE id_increment SET max_number=? WHERE tablename="students"', [next_std_id],
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

//GET method for get all the details of students 
exports.getStudents = async (req, res, next) => {
    try {
        var datetime = new Date();
        console.log("\nStudent Details by Admin, Time:", datetime.toTimeString());
        const pool = await connection.poolPromise;
        var arr = [];
        await pool.getConnection(async (err, connection) => {
            if (!err) {
                await connection.query('SELECT STD.*, S.sv_name,S.sv_contact,S.sv_email,I.inst_name, I.inst_address, I.inst_contact,G.standard FROM students STD JOIN supervisors S ON STD.sv_id = S.sv_id JOIN institutes I ON STD.inst_id=I.inst_id JOIN grades G ON STD.grade_id=G.grade_id order by std_id', (error, results, fields) => {
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

//POST method for update the details of students by admin
exports.updateStudents = async (req, res, next) => {
    try {
        var datetime = new Date();
        console.log("\nStudent update by Admin, Time:", datetime.toTimeString());

        //getting the data of students
        let data = req.body;
        console.log(data);
        var birthdate = data.std_birthdate.split('T')[0];
        // console.log(birthdate);
        //transaction of data in database
        const pool = await connection.poolPromise;
        await pool.getConnection(async (err, connection) => {
            if (!err) {
                await connection.beginTransaction(async (err) => {
                    if (err) {
                        throw err;
                    }
                    await connection.query('SELECT sv_id FROM students WHERE std_id=?',
                        [data.std_id],
                        async (error, results, fields) => {
                            var sv_id = results[0].sv_id;
                            if (error) {
                                return connection.rollback(() => {
                                    throw error;
                                });
                            } else if (sv_id != data.sv_id) {
                                await connection.query('UPDATE students SET std_name=?,std_gender=?,std_address=?,std_contact=?,std_birthdate=?,sv_id=?,inst_id=?,grade_id=? WHERE std_id=?',
                                    [data.std_name, data.std_gender, data.std_address, data.std_contact, birthdate, data.sv_id, data.inst_id, data.grade_id, data.std_id],
                                    async (error, results, fields) => {
                                        if (error) {
                                            return connection.rollback(() => {
                                                throw error;
                                            });
                                        } else {
                                            await connection.query('UPDATE device_info SET sv_id=? WHERE sv_id=? and device_id=?',
                                                [data.sv_id, sv_id, data.device_id],
                                                async (error, results, fields) => {
                                                    if (error) {
                                                        return connection.rollback(() => {
                                                            throw error;
                                                        });
                                                    } else {
                                                        await connection.query('UPDATE supervisors SET no_students=no_students-1 WHERE sv_id=?',
                                                            [sv_id],
                                                            async (error, results, fields) => {
                                                                if (error) {
                                                                    return connection.rollback(() => {
                                                                        throw error;
                                                                    });
                                                                } else {
                                                                    await connection.query('UPDATE supervisors SET no_students=no_students+1 WHERE sv_id=?',
                                                                        [data.sv_id],
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
                                                                }
                                                            });
                                                    }
                                                });

                                        }
                                    });

                            } else {
                                await connection.query('UPDATE students SET std_name=?,std_gender=?,std_address=?,std_contact=?,std_birthdate=?,sv_id=?,inst_id=?,grade_id=? WHERE std_id=?',
                                    [data.std_name, data.std_gender, data.std_address, data.std_contact, birthdate, data.sv_id, data.inst_id, data.grade_id, data.std_id],
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

//POST method for delete students details by admin
exports.deleteStudetns = async (req, res, next) => {
    try {
        var datetime = new Date();
        console.log("\nStudent delete by Admin, Time:", datetime.toTimeString());

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
                    await connection.query('DELETE FROM student_login WHERE std_id=?', [data.std_id],
                        async (error, results, fields) => {
                            // var count = JSON.stringify(results[0].count);
                            if (error) {
                                return connection.rollback(() => {
                                    throw error;
                                });
                            } else {
                                await connection.query('DELETE FROM students WHERE std_id=?', [data.std_id],
                                    async (error, results, fields) => {
                                        // var count = JSON.stringify(results[0].count);
                                        if (error) {
                                            return connection.rollback(() => {
                                                throw error;
                                            });
                                        } else {
                                            await connection.query('UPDATE supervisors SET no_students=no_students-1 WHERE sv_id=?', [data.sv_id],
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
