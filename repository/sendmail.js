var nodemailer = require('nodemailer');
const UserModel = require("../models/UserModel");
const jwt = require('jsonwebtoken');
const bcrypt = require("bcryptjs");
const SECRET_KEY = 'this is my secret for jwt';

function ForgetPassword(req, res){
        UserModel.findOne({ email: req.body.email }, (err,user)=>{
            if(!user){
                res.send({status:404, msg: "User not Found"});
            }
            else{
                const mail = req.body.email
                const token = jwt.sign({mail}, SECRET_KEY, {expiresIn: '30m' });
                var transporter = nodemailer.createTransport({
                    service: 'outlook',
                    auth: {
                      user: 'weatherapp.stackroute@outlook.com',
                      pass: 'Weatherapp2022'
                    }
                });
                
                var mailOptions = {
                    from: 'weatherapp.stackroute@outlook.com',
                    to: req.body.email,
                    subject: 'Password reset link',
                    html: `<h1>Password Reset Link</h1> 
                            To reset your Password <a href="http://localhost:3000/confirmpass/${token}">Click Here</a> `  
                };
                
                transporter.sendMail(mailOptions, function(error, info){
                    if (error) {
                      console.log(error);
                    } else {
                      res.send('Password reset link sent to your email')
                    }
                });
            
                const update = UserModel.findOneAndUpdate({ email: req.body.email },
                  { resetlink: token } , (err)=>{
                     if(err){
                         res.send(err);
                      }
                 });
            }
        })  

}

function ResetPassworrd(req, res) {
  const resetlink = req.body.token;
  const newPass = req.body.newPass;
  if (resetlink){
    jwt.verify(resetlink, SECRET_KEY, (err, decode) => {
      if(err){
        return res.send({status:401, msg: "Token Error"});
      }
      else{
        UserModel.findOne({resetlink}, (err, user) => {
          if(err || !user){
            return res.send({status:401, msg: "User with this token does not exist"});
          }
          const obj = {
            password: bcrypt.hashSync(newPass, 10),
            resetlink: ''
          }
          const update = UserModel.findOneAndUpdate({ resetlink: resetlink },obj, (err)=>{
               if(err){
                   res.send(err);
                }
                else{
                  res.send("Password Updated successfuly");
                }
           });
          

        });
      }
    });
  }
  else{
    return res.send({status:401, msg: "Authentication error"});
  }
}


module.exports = {ForgetPassword, ResetPassworrd}