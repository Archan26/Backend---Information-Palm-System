const connection = require('../utils/connection.js');

//next id of categories
exports.nextId = async (req, res) => {
    try {
        var datetime = new Date();
        console.log("\nCategories next number by Admin, Time:", datetime.toTimeString());
        const pool = await connection.poolPromise;
        var arr = [];
        await pool.getConnection(async (err, connection) => {
            if (!err) {
                await connection.query("SELECT max_number as next_number FROM id_increment WHERE tablename='categories'", (error, results, fields) => {
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

//API for inserion of categories by admin
exports.registerCategory = async (req, res) => {
    try {
        var datetime = new Date();
        console.log("\nCategories registration by Admin, Time:", datetime.toTimeString());
        //getting the data of categories
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
                    await connection.query('SELECT max_number FROM id_increment WHERE tablename="categories"',
                        async (error, results, fields) => {
                            if (error) {
                                return connection.rollback(() => {
                                    throw error;
                                });
                            } else {
                                var next_cat_id = results[0].max_number + 1;
                                console.log("Next Number:" + next_cat_id);

                                await connection.query('INSERT INTO categories (cat_id, cat_name) VALUES(?,?)',
                                    [next_cat_id, data.cat_name],
                                    async (error, results, fields) => {
                                        if (error) {
                                            return connection.rollback(() => {
                                                res.status(409).send({
                                                    success: false,
                                                    msg: "Category is already exist"
                                                });
                                            });
                                        } else {
                                            await connection.query('UPDATE id_increment SET max_number=? WHERE tablename="categories"', [next_cat_id],
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

//API for get all the details of categories
exports.getDetails = async (req, res) => {
    try {
        var datetime = new Date();
        console.log("\nCategories Details by Admin, Time:", datetime.toTimeString());
        const pool = await connection.poolPromise;
        var arr = [];
        await pool.getConnection(async (err, connection) => {
            if (!err) {
                await connection.query('SELECT * FROM categories', (error, results, fields) => {
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

//API to update the details of categories
exports.updateCategory = async (req, res) => {
    try {
        var datetime = new Date();
        console.log("\nCategories details update by Admin, Time:", datetime.toTimeString());
        //getting the data of categories
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
                    await connection.query('UPDATE categories SET cat_name=? WHERE cat_id=?',
                        [data.cat_name, data.cat_id],
                        async (error, results, fields) => {
                            if (error) {
                                return connection.rollback(() => {
                                    res.status(409).send({
                                        success: false,
                                        msg: "Category is already exist"
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

//API to delete categories details
exports.deleteCategory = async (req, res) => {
    try {
        var datetime = new Date();
        console.log("\nCategories details delete by Admin, Time:", datetime.toTimeString());
        //getting the id of categories
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
                    await connection.query('SELECT COUNT(cat_id) as count from books WHERE cat_id=?', [data.cat_id],
                        async (error, results, fields) => {
                            var count = JSON.stringify(results[0].count);
                            if (error) {
                                return connection.rollback(() => {
                                    throw error;
                                });
                            } else if (count == 0) {
                                await connection.query('DELETE FROM categories WHERE cat_id=?', [data.cat_id],
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
                                    msg: "You cannot delete the Category's details"
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
