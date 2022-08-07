const repository = require('../repository/authRepository');

function RegisterUser(req, res) {
    repository.RegisterUser(req.body).then(data => {
        if (data.status === 409) {
            res.status(409).send({ status: 409, message: "User with specified email already exists" })
        }
        else if (data.status === 200) {
            res.status(200).send({ status: 200, message: "User Registered Successfully!", Data: data })
        }
        else {
            res.send()
        }
    })
}


function LoginUser(req, res) {
    repository.LoginUser(req.body).then(data => {
        if (data.status === 200) {
            res.status(data.status).send(data)
            console.log(req.session.cookie);
        }
        else if (data.status === 201) {
            res.status(data.status).send(data)
        }
        else {
            res.status(data.status).send(data)
        }
    })
}


function UpdatePassword(req, res) {
    repository.UpdatePassword(req.token, req.body).then(data => {
        if (data.status === 200) {
            res.status(200).send(data)
        }
        else {
            res.status(404).send(data);
        }
    })
}



function UpdateProfile(req, res) {
    repository.UpdateProfile(req.token, req.body).then(data => {
        if (data.status === 200) {
            res.status(200).send(data)
        }
        else {
            res.status(404).send(data);
        }
    })
}


function GetUser(req,res){
    repository.GetUser(req.params).then(data=>{
        if(data.status===200){
            res.status(200).send(data)
        }
        else{
            res.status(404).send(data.msg);
        }
    });
}


function LogoutUser(req,res){
        try {
            req.session.destroy();
            res.send({msg:"Logout Succesfully"})
        } catch (error) {
            res.send(error.message)
        }
        
}


module.exports = { RegisterUser, LoginUser, UpdatePassword, UpdateProfile, GetUser, LogoutUser }