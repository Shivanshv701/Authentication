const UserModel = require("../models/UserModel");
const { v4: uuidv4 } = require('uuid');
const nodemailer = require("nodemailer");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const privateKey = "this is my secret for jwt"
function RegisterUser(data) {
    return new Promise((resolve, reject) => {
        UserModel.findOne({ email: data.email }, (err, user) => {
            if (user) {
                resolve({ status: 409, message: 'User with specified email already exists' })
            } else if (!user) {
                let user = new UserModel();
                user._id = uuidv4();
                user.firstname = data.firstname;
                user.lastname = data.lastname;
                user.email = data.email;
                user.password = bcrypt.hashSync(data.password, 10);
                user.resetlink = '';
                user.save((err) => {
                    if (!err) {
                        resolve({ status: 200, Data: user })
                    } else {
                        throw err;
                    }
                });
            } else {
                reject(err);
            }
        });
    });
}

function LoginUser(data) {
    return new Promise((resolve, reject) => {
        UserModel.findOne({ email: data.email }, (err, user) => {
            if (user) {
                const compare = bcrypt.compareSync(data.password, user.password);
                if (compare) {
                    const payload = { email: data.email }
                    const generateToken = jwt.sign(payload, privateKey);
                    resolve({ status: 200, msg: "login successfully", token: generateToken });
                    
                }
                else {
                    reject({ status: 404, msg: "This E-mail Does not Exist" });
                }
            }
            else {
                reject({ status: 201, msg: "Check your password" });
            }
        });
    });
}


function GetUser(data) {
    return new Promise((resolve, reject) => {
        UserModel.findOne({ email: data.email }, (err,user)=>{
            if(!user){
                reject({status:404, msg: "User not Found"});
            }
            else{
                resolve({status:200,msg:"user found",User:user});
            }
        })
    })
}


function UpdatePassword(data1, data2) {
    return new Promise((resolve, reject) => {
        UserModel.findOneAndUpdate({ email: data1.email }, { password: bcrypt.hashSync(data2.password, 10) }, (err, user) => {
            if (!user) {
                reject({ status: 404, msg: "User not Found" });
            }
            else {
                resolve({ status: 200, msg: "password updated", User: user.password });
            }
        })
    })
}


function UpdateProfile(data1, data2) {
    return new Promise((resolve, reject) => {
        UserModel.findOneAndUpdate({ email: data1.email }, { firstname: data2.firstname, lastname: data2.lastname }, (err, user) => {
            if (!user) {
                reject({ status: 404, msg: "User not Found" });
            }
            else {
                resolve({ status: 200, msg: "user profile updated", User: user });
            }
        })
    })
}

module.exports = { RegisterUser, LoginUser, GetUser, UpdatePassword, UpdateProfile }