let jwt = require('jsonwebtoken');
const mssg = require('./hiddenMessage.js');


//This function will check token is valid or not!
let checkToken = (req, res, next) => {
   let token = req.headers.token;
   var decodedToken = jwt.decode(token);
   // console.log(decodedToken);
   // var key = decodedToken.username;
   // console.log("keys:" + JSON.stringify(decodedToken));
   // if (!"admin_id" in decodedToken) {
   //    console.log("True Admin");
   // }
   // if (!"sv_id" in decodedToken) {
   //    console.log("True Supervisor");
   // }
   // console.log("user:" + key);
   // console.log("token:" + token);
   // console.log(req.connection.remoteAddress);

   if (token && "admin_id" in decodedToken) {
      jwt.verify(token, mssg.adminSecret, (err, decoded) => {
         if (err) {
            return res.status(403).json({
               success: false,
               message: 'Invalid Token'
            });
         } else {
            req.decoded = decoded;
            next();
         }
      });
   } else if (token && "sv_id" in decodedToken) {
      jwt.verify(token, mssg.supervisorSecret, (err, decoded) => {
         if (err) {
            return res.status(403).json({
               success: false,
               message: 'Invalid Token'
            });
         } else {
            req.decoded = decoded;
            next();
         }
      });
   } else if (token && "std_id" in decodedToken) {
      jwt.verify(token, mssg.studentSecret, (err, decoded) => {
         if (err) {
            return res.status(403).json({
               success: false,
               message: 'Invalid Token'
            });
         } else {
            req.decoded = decoded;
            next();
         }
      });
   } else {
      return res.status(401).json({
         success: false,
         message: 'Auth token is not supplied'
      });
   }
};

module.exports = {
   checkToken: checkToken
}