const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../Models/UserSchema');

const validateEmail = (email) => {
  const regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return (regex.test(email) && email !== undefined);
};

const validateName = (name) => {
  const regex = /^[a-zA-Z ]{2,30}$/;
  return (regex.test(name) && name !== undefined);
};

const validate = (name, email, sector, role, pass) => {
  if (!validateName(name) || !validateEmail(email) ||
      pass === undefined || pass.length < 6 ||
      sector === undefined || sector.length === 0 ||
      role === undefined || role.lenght === 0) {
    return false;
  }
  return true;
};

const hashPass = async (pass, saltRounds = 10) => {
  const salt = await bcrypt.genSalt(saltRounds);
  return bcrypt.hash(pass, salt);
};

// ROTAS
const signUpGet = async (req, res) => {
  const users = await User.find();

  return res.status(200).json(users);
};

const signUpPost = async (req, res) => {
  const {
    name, email, sector, role, pass,
  } = req.body;

  if (!validate(name, email, sector, role, pass)) {
    return res.json({ message: 'invalid' });
  }

  const user = await User.create({
    name,
    email,
    sector,
    role,
    pass: await hashPass(pass),
  });

  return res.json(user);
};

const signUpPut = async (req, res) => {
  const { id } = req.params;
  const {
    name, email, sector, role, pass,
  } = req.body;
  let newPass;
  if (!validate(name, email, sector, role, pass)) {
    return res.json({ message: 'invalid' });
  }

  const usuarioEncontrado = await User.findOne({ _id: id });

  // Senha nao se altera
  if (await bcrypt.compare(req.body.pass, usuarioEncontrado.pass)) {
    newPass = usuarioEncontrado.pass;
  } else {
    newPass = await hashPass(pass);
  }

  const updateReturn = await User.findOneAndUpdate({ _id: id }, {
    name, email, sector, role, pass: newPass,
  },
  { new: true }, (err, user) => {
    if (err) {
      return res.json(err);
    }
    return res.json(user);
  });

  return updateReturn;
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
