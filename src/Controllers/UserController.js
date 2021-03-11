const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../Models/UserSchema');
const validation = require('../Utils/validate');
const hash = require('../Utils/hashPass')


// ROTAS
const signUpGet = async (req, res) => {
  const users = await User.find();

  return res.status(200).json(users);
};

const signUpPost = async (req, res) => {
  const {
    name, email, sector, role, pass,
  } = req.body;

  const errorMessage = validation.validate(name, email, sector, role, pass);

  if (errorMessage.length) {
    return res.json({ message: errorMessage });
  }

  try{
    const user = await User.create({ 
      name,
      email,
      sector,
      role,
      pass: await hash.hashPass(pass),
    });
    return res.json(user);
  } catch (error) {
    return res.json({ duplicated: error.keyValue });  
  }

};

const signUpPut = async (req, res) => {
  const { id } = req.params;
  const {
    name, email, sector, role, pass,
  } = req.body;
  let newPass;

  const errorMessage = validation.validate(name, email, sector, role, pass);

  if (errorMessage.length) {
    return res.json({ message: errorMessage });
  }

  const usuarioEncontrado = await User.findOne({ _id: id });

  // Senha nao se altera
  if (await bcrypt.compare(req.body.pass, usuarioEncontrado.pass)) {
    newPass = usuarioEncontrado.pass;
  } else {
    newPass = await hash.hashPass(pass);
  }

  try{
    const updateReturn = await User.findOneAndUpdate({ _id: id }, {
      name, email, sector, role, pass: newPass,
    },
    { new: true });
      return res.json(updateReturn);
  } catch (error) {
    return res.json({ duplicated: error.keyValue });
  }
};

const signUpDelete = async (req, res) => {
  const { id } = req.params;

  const userReturn = await User.deleteOne({ _id: id });

  if (userReturn.deletedCount === 1) {
    return res.json({ message: 'success' });
  }
  return res.json({ message: 'failure' });
};

const login = async (req, res) => {
  const usuario = await User.findOne({ email: req.body.email });

  // usuario invalido
  if (usuario == null) {
    return res.json({ message: 'nao existe' });
  }

  // senha correta
  if (await bcrypt.compare(req.body.pass, usuario.pass)) {
    const { id } = usuario;
    const token = jwt.sign({ id }, process.env.SECRET, {
      expiresIn: 240,
    });
    return res.json({ auth: true, token });
  }
  // senha incorreta

  return res.json({ message: 'senha incorreta' });
};

module.exports = {
  signUpGet, signUpPost, signUpPut, signUpDelete, login,
};
