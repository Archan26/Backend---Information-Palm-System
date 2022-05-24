const connection = require('../utils/connection.js');


//API for get all the counts 
exports.getCounts = async (req, res) => {
    try {
        var datetime = new Date();
        console.log("\nDashboard Details by Admin, Time:", datetime.toTimeString());
        const pool = await connection.poolPromise;
        var arr = [];
        await pool.getConnection(async (err, connection) => {
            if (!err) {
                await connection.query('SELECT sv_id,sv_status FROM supervisors;SELECT device_id,device_status FROM device_info; SELECT COUNT(book_id) as total_books from books;SELECT count(std_id) as total_students from students;SELECT COUNT(inst_id) as total_institutes from institutes;', (error, results, fields) => {
                    if (error) {
                        console.log(error);
                        throw error
                    };
                    results = JSON.stringify(results);
                    results = JSON.parse(results);

                    // results.forEach(element => {
                    //     arr.push(element)
                    // });
                    // console.log(results);

                    var verified = 0, un_verified = 0;

                    //supervisor's count
                    for (let i = 0; i < results[0].length; i++) {
                        if (results[0][i].sv_status === 1) {
                            verified += 1;
                        } else {
                            un_verified += 1;
                        }
                    }

                    var assign = 0, not_assign = 0;

                    //device's count
                    for (let i = 0; i < results[1].length; i++) {
                        if (results[1][i].device_status === 1) {
                            assign += 1;
                        } else {
                            not_assign += 1;
                        }
                    }

                    var data = {
                        "total_sv_verified": verified,
                        "total_sv_un_verified": un_verified,
                        "total_assign_device": assign,
                        "total_notassign_device": not_assign,
                        "total_books": results[2][0].total_books,
                        "total_students": results[3][0].total_students,
                        "total_institutes": results[4][0].total_institutes - 1
                    }

                    arr.push(data);
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

