const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const connection = require('../utils/connection.js');
const hiddenMessage = require('../middleWare/hiddenMessage.js');


//POST method for login of admin
exports.login = async (req, res) => {
   try {
      var datetime = new Date();
      var username = req.body.username;
      var password = req.body.password;

      console.log("\nAdmin");
      console.log("Username:", username, " Time:", datetime.toTimeString());
      console.log("Password:", password);

      // hashedPassword = await bcrypt.hash(req.body.password, 5)
      // console.log("Hash : ", hashedPassword);
      // let isEqual = await bcrypt.compare(req.body.password, hashedPassword)

      const pool = await connection.poolPromise;
      await pool.getConnection(async (err, connection) => {
         if (!err) {
            await connection.query("SELECT * FROM admin_login WHERE username=?", [username], async (error, results, fields) => {
               if (error) {
                  console.log(error);
                  throw error
               };

               if (results.length != 0) {
                  // console.log(results[0]);
                  let isEqual = await bcrypt.compare(password, results[0].password);
                  if (isEqual) {
                     let token = jwt.sign({
                        username: username,
                        admin_id: results[0].admin_id
                     },
                        hiddenMessage.adminSecret, {
                        expiresIn: '24h' // expires in 24 hours
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
   } catch (err) {
      res.status(500).send({
         success: false,
         msg: "Internal Server Error",
      });
   }

};