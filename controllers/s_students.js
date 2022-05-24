let jwt = require('jsonwebtoken');
const connection = require('../utils/connection.js');
const bcrypt = require('bcrypt');


//Institutes details
//Grades details
//GET method for next id of student
exports.nextId = async (req, res) => {
    try {
        var datetime = new Date();
        console.log("\nStudent next number by Supervisor, Time:", datetime.toTimeString());

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
exports.getCommon = async (req, res) => {
    try {
        var datetime = new Date();
        console.log("\nStudent common by Supervisor, Time:", datetime.toTimeString());
        const pool = await connection.poolPromise;
        var arr = [];
        await pool.getConnection(async (err, connection) => {
            if (!err) {
                await connection.query("SELECT * from institutes; SELECT * from grades;", (error, results, fields) => {
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

//API for registration of students by admin
exports.studentRegistration = async (req, res) => {
    try {
        var datetime = new Date();
        console.log("\nStudent register by Supervisor, Time:", datetime.toTimeString());
        let token = req.headers.token;
        var decodedToken = jwt.decode(token);
        console.log(decodedToken);
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
                                    [next_std_id, data.std_name, data.std_gender, data.std_address, data.std_contact, data.std_birthdate, decodedToken.sv_id, data.inst_id, data.grade_id],
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
                                                        await connection.query('UPDATE supervisors SET no_students=no_students+1 WHERE sv_id=?', [decodedToken.sv_id],
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

//API for get all the details of students 
exports.getDetails = async (req, res) => {
    try {
        var datetime = new Date();
        console.log("\nStudent details by Supervisor, Time:", datetime.toTimeString());
        let token = req.headers.token;
        var decodedToken = jwt.decode(token);
        console.log(decodedToken);
        const pool = await connection.poolPromise;
        var arr = [];
        await pool.getConnection(async (err, connection) => {
            if (!err) {
                await connection.query('SELECT STD.*,I.inst_name, I.inst_address, I.inst_contact,G.standard FROM students STD JOIN institutes I ON STD.inst_id=I.inst_id JOIN grades G ON STD.grade_id=G.grade_id WHERE STD.sv_id=? order by STD.std_id;',
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
        res.status(500).send({
            success: false,
            msg: "Internal Server Error",
        });
    }
};

//API to update the details of students
exports.updateStudent = async (req, res) => {
    try {
        var datetime = new Date();
        console.log("\nStudent update by Supervisor, Time:", datetime.toTimeString());
        let token = req.headers.token;
        var decodedToken = jwt.decode(token);
        console.log(decodedToken);
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
                    await connection.query('UPDATE students SET std_name=?,std_gender=?,std_address=?,std_contact=?,std_birthdate=?,sv_id=?,inst_id=?,grade_id=? WHERE std_id=?',
                        [data.std_name, data.std_gender, data.std_address, data.std_contact, data.std_birthdate, decodedToken.sv_id, data.inst_id, data.grade_id, data.std_id],
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

//API to delete students details
exports.deleteStudent = async (req, res) => {
    try {
        var datetime = new Date();
        console.log("\nStudent delete by Supervisor, Time:", datetime.toTimeString());
        let token = req.headers.token;
        var decodedToken = jwt.decode(token);
        console.log(decodedToken);
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
                                            await connection.query('UPDATE supervisors SET no_students=no_students-1 WHERE sv_id=?', [decodedToken.sv_id],
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

