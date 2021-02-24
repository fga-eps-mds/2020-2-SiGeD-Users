const User = require('../Models/UserSchema');

const signUpGet = async (req, res) => {
    const users = await User.find()
    
    return res.json(users);
}

const signUpPost = async (req, res) => {
    const user = await User.create(req.body);

    

    return res.json(user)
}

const signUpPut = async (req, res) => {
    const id = req.params.id;

    const updateReturn = await User.findOneAndUpdate({_id:id}, req.body, 
        { new:  true }, (err, user)=>{
            if(err){
                return res.json(err);
            } else{
                return res.json(user);
            }
    })
}

const signUpDelete = async (req, res) => {
    const id = req.params.id

    const userReturn = await User.deleteOne({_id: id})

    console.log(userReturn);

    if (userReturn.deletedCount === 1) {
        return res.json({message:"success"});
    } else {
        return res.json({message:"failure"});
    }
}

module.exports = {signUpGet, signUpPost, signUpPut, signUpDelete}
