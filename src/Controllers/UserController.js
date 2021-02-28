const User = require('../Models/UserSchema');
const bcrypt = require('bcrypt');

const signUpGet = async (req, res) => {
    const users = await User.find()
    
    return res.json(users);
}

const signUpPost = async (req, res) => {
    let {name, email, enroll, pass} = req.body;

    if (!validate(name, email, enroll, pass)) {
        return res.json({"message":"invalid"});
    }

    const user = await User.create({
        name: name, 
        email: email,
        enroll: enroll,
        pass: await hashPass(pass)
    });

    return res.json(user);
}

const signUpPut = async (req, res) => {
    const id = req.params.id;
    let {name, email, enroll, pass} = req.body;

    if (!validate(name, email, enroll, pass)) {
        return res.json({"message":"invalid"});
    }

    const usuarioEncontrado = await User.findOne({_id:id});

    //senha nao se altera
    if (await bcrypt.compare(req.body.pass, usuarioEncontrado.pass)) {
        pass = usuarioEncontrado.pass;
    } 
    //senha alterada
    else { 
        pass = await hashPass(pass);
    }

    const updateReturn = await User.findOneAndUpdate({_id:id}, {name, email, enroll, pass}, 
        { new:  true }, (err, user)=>{
            if (err) {
                return res.json(err);
            } else {
                return res.json(user);
            }
    })
}

const signUpDelete = async (req, res) => {
    const id = req.params.id

    const userReturn = await User.deleteOne({_id: id});

    if (userReturn.deletedCount === 1) {
        return res.json({message:"success"});
    } else {
        return res.json({message:"failure"});
    }
}

const validate = (name, email, enroll, pass) => {
    if (enroll == undefined || pass == undefined || !validateEmail(email) || !validateName(name)) {
        return false;
    }
    return true;
}

const validateEmail = (email) => {
    const regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regex.test(email);   
}

const validateName = (name) => {
    const regex = /^[a-zA-Z ]{2,30}$/;
    return regex.test(name);
} 

const hashPass = async (pass, saltRounds = 10) => {
    const salt = await bcrypt.genSalt(saltRounds);
    return await bcrypt.hash(pass, salt);
}

module.exports = {signUpGet, signUpPost, signUpPut, signUpDelete}
