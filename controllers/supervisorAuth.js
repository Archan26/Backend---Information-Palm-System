const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const connection = require('../utils/connection.js');
const hiddenMessage = require('../middleWare/hiddenMessage.js');


//API for registration of supervisors 
exports.supervisorRegistration = async (req, res) => {
   try {
      //getting the data from supervisor
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
               await connection.query('SELECT username FROM supervisor_login WHERE username=?', [data.username],
                  async (error, results, fields) => {
                     if (error) {
                        return connection.rollback(() => {
                           throw error;
                        });
                     } else if (results.length == 0) {
                        // console.log("Length:" + results.length);
                        await connection.query('SELECT max_number FROM id_increment WHERE tablename="supervisors"',
                           async (error, results, fields) => {
                              if (error) {
                                 return connection.rollback(() => {
                                    throw error;
                                 });
                              } else {
                                 var next_sv_id = results[0].max_number + 1;
                                 // console.log("Next Number:" + next_sv_id);
                                 await connection.query('INSERT INTO supervisors (sv_id,sv_name,sv_contact,sv_email,sv_location) VALUES(?,?,?,?,?)',
                                    [next_sv_id, data.sv_name, data.sv_contact, data.sv_email, data.sv_location],
                                    async (error, results, fields) => {
                                       if (error) {
                                          return connection.rollback(() => {
                                             throw error;
                                          });
                                       } else {
                                          hashedPassword = await bcrypt.hash(data.password, 5)
                                          // console.log("Hash : ", hashedPassword);
                                          await connection.query('INSERT INTO supervisor_login (username,password,sv_id) VALUES(?,?,?)',
                                             [data.username, hashedPassword, next_sv_id],
                                             async (error, results, fields) => {
                                                if (error) {
                                                   return connection.rollback(() => {
                                                      throw error;
                                                   });
                                                } else {
                                                   await connection.query('UPDATE id_increment SET max_number=? WHERE tablename="supervisors"', [next_sv_id],
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
                                                               res.status(200).send({
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
                              }
                           });
                     } else {
                        res.status(409).send({
                           success: false,
                           msg: "User already exist, choose different username"
                        });
                     }
                  });
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
   } catch (err) {
      res.status(500).send({
         success: false,
         msg: "Internal Server Error",
      });
   }
};

//API for login of supervisor
exports.login = async (req, res) => {
   var datetime = new Date();
   var username = req.body.username;
   var password = req.body.password;
   console.log("\nUsername:", username, " Time:", datetime.toTimeString());
   console.log("Password:", password);

   // hashedPassword = await bcrypt.hash(req.body.password, 10)
   // console.log("Hash : ", hashedPassword);
   // let isEqual = await bcrypt.compare(req.body.password, hashedPassword)

   const pool = await connection.poolPromise;
   await pool.getConnection(async (err, connection) => {
      if (!err) {
         await connection.query("SELECT * FROM supervisor_login WHERE username=?", [username],
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
                  // console.log('SV_ID: ' + results[0].sv_id);
                  // console.log(results[0]);
                  var sv_id = results[0].sv_id;
                  let isEqual = await bcrypt.compare(password, results[0].password);
                  if (isEqual) {
                     await connection.query('SELECT sv_status FROM supervisors WHERE sv_id=?', [sv_id],
                        async (error, results, fields) => {
                           if (error) {
                              return connection.rollback(() => {
                                 throw error;
                              });
                           } else if (results[0].sv_status === 1) {
                              let token = jwt.sign({
                                 username: username,
                                 sv_id: sv_id
                              },
                                 hiddenMessage.supervisorSecret, {
                                 expiresIn: '24h' // expires in 24 hours
                              });

                              // return the JWT token for the future API calls
                              res.status(200).send({
                                 success: true,
                                 msg: 'Successfully logged in',
                                 sToken: token
                              });
                           } else {
                              res.status(401).send({
                                 success: false,
                                 msg: 'Please verified your account first'
                              });
                           }
                        });

                  } else {
                     res.status(401).send({
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
