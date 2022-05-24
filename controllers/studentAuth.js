const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const connection = require('../utils/connection.js');
const hiddenMessage = require('../middleWare/hiddenMessage.js');


//API for login of students
exports.login = async (req, res) => {
    var datetime = new Date();
    var username = req.body.username;
    var password = req.body.password;
    console.log("\nStudent");
    console.log("Username:", username, " Time:", datetime.toTimeString());
    console.log("Password:", password);

    // hashedPassword = await bcrypt.hash(req.body.password, 5)
    // console.log("Hash : ", hashedPassword);
    // let isEqual = await bcrypt.compare(req.body.password, hashedPassword)

    const pool = await connection.poolPromise;
    await pool.getConnection(async (err, connection) => {
        if (!err) {
            await connection.query("SELECT * FROM student_login WHERE username=?", [username],
                async (error, results, fields) => {
                    if (error) {
                        console.log(error);
                        throw error
                    };

                    if (results.length != 0) {
                        // results = JSON.stringify(results);
                        // results = JSON.parse(results);
                        //  results.forEach(element => {
                        //      arr.push(element)
                        //  });
                        // console.log(results[0]);
                        var std_id = results[0].std_id;
                        let isEqual = await bcrypt.compare(password, results[0].password);

                        if (isEqual) {
                            await connection.query('SELECT device_id FROM students WHERE std_id=?', [std_id],
                                async (error, results, fields) => {
                                    var device_id = results[0].device_id;
                                    console.log("DID: ", device_id);
                                    if (error) {
                                        return connection.rollback(() => {
                                            throw error;
                                        });
                                    } else if (device_id != null) {
                                        await connection.query('SELECT unique_id FROM device_info WHERE device_id=?', [device_id],
                                            async (error, results, fields) => {
                                                console.log("UID: ", results[0].unique_id);
                                                if (error) {
                                                    return connection.rollback(() => {
                                                        throw error;
                                                    });
                                                } else if (results[0].unique_id === req.body.unique_id) {
                                                    let token = jwt.sign({
                                                        username: username,
                                                        std_id: std_id
                                                    },
                                                        hiddenMessage.studentSecret, {
                                                        expiresIn: '90d' // expires in 24 hours
                                                    });

                                                    // return the JWT token for the future API calls
                                                    res.status(200).json({
                                                        success: true,
                                                        msg: 'Successfully logged in',
                                                        token: token
                                                    });
                                                } else {
                                                    res.status(401).json({
                                                        success: false,
                                                        msg: 'You have not been assigned with this device'
                                                    });
                                                }
                                            })

                                    } else {
                                        res.status(401).json({
                                            success: false,
                                            msg: 'You have not been assigned any device'
                                        });
                                    }
                                })

                        } else {
                            res.status(401).json({
                                success: false,
                                msg: 'Incorrect Username or Password'
                            });
                        }

                    } else {
                        res.status(401).send({
                            success: false,
                            msg: 'Incorrect Username or Password'
                        });
                    }

                });
            connection.release();
        } else {
            console.log("Failed to connect with database");
            res.status(500).send({
                success: false,
                msg: "Internal Server Error"
            });
        }
    });
};

// exports.post('/add', async (req, res) => {
//     // var datetime = new Date();
//     // var username = req.body.username;
//     // var password = req.body.password;
//     // console.log("\nUsername:", username, " Time:", datetime.toTimeString());
//     // console.log("Password:", password);

//     // hashedPassword = await bcrypt.hash(req.body.password, 5)
//     // console.log("Hash : ", hashedPassword);
//     // let isEqual = await bcrypt.compare(req.body.password, hashedPassword)

//     const pool = await connection.poolPromise;
//     await pool.getConnection(async (err, connection) => {
//         if (!err) {
//             await connection.query("SELECT std_name FROM students", async (error, results, fields) => {
//                 if (error) {
//                     console.log(error);
//                     throw error
//                 };
//                 results = JSON.stringify(results);
//                 results = JSON.parse(results);
//                 //  results.forEach(element => {
//                 //      arr.push(element)
//                 //  });
//                 console.log(results);

//                 for (let i = 0; i < 71; i++) {
//                     var str = results[i].std_name;
//                     str = str.replace(/\s+/g, '').toLowerCase();
//                     console.log("STR: " + str);

//                     hashedPassword = await bcrypt.hash(str, 10)
//                     console.log("Hash : ", hashedPassword);

//                     await connection.query('INSERT INTO student_login (username,password,std_id) VALUES(?,?,?)', [str, hashedPassword, (i + 1)],
//                         async (error, results, fields) => {
//                             if (error) {
//                                 return connection.rollback(() => {
//                                     throw error;
//                                 });
//                             } else {
//                                 connection.commit((err) => {
//                                     if (err) {
//                                         return connection.rollback(() => {
//                                             throw err;
//                                         });
//                                     }
//                                 });
//                             }
//                         });
//                     console.log("Success " + (i + 1));
//                 }
//             });
//         } else {
//             console.log("Failed to connect with database");
//             res.status(500).send({
//                 success: false,
//                 msg: "Internal Server Error"
//             });
//         }
//     });
// });

