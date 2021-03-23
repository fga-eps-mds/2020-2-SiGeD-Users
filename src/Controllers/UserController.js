const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const moment = require('moment-timezone');
const User = require('../Models/UserSchema');
const validation = require('../Utils/validate');
const hash = require('../Utils/hashPass');

// ROTAS
const signUpGet = async (req, res) => {
  const users = await User.find();

  return res.status(200).json(users);
};

const signUpPost = async (req, res) => {
  const {
    name, email, role, sector, pass,
  } = req.body;

  const errorMessage = validation.validate(name, email, role, sector, pass);

  if (errorMessage.length) {
    return res.json({ message: errorMessage });
  }

  try {
    const user = await User.create({
      name,
      email,
      role,
      sector,
      pass: await hash.hashPass(pass),
      createdAt: moment.utc(moment.tz('America/Sao_Paulo').format('YYYY-MM-DDTHH:mm:ss')).toDate(),
      updatedAt: moment.utc(moment.tz('America/Sao_Paulo').format('YYYY-MM-DDTHH:mm:ss')).toDate(),
    });
    return res.json(user);
  } catch (error) {
    return res.json({ duplicated: error.keyValue });
  }
};

const signUpPut = async (req, res) => {
  const { id } = req.params;
  const {
    name, email, role, sector, pass,
  } = req.body;
  let newPass;

  const errorMessage = validation.validate(name, email, role, sector, pass);

  if (errorMessage.length) {
    return res.json({ message: errorMessage });
  }

  const findUser = await User.findOne({ _id: id });

  // Senha nao se altera
  if (await bcrypt.compare(req.body.pass, findUser.pass)) {
    newPass = findUser.pass;
  } else {
    newPass = await hash.hashPass(pass);
  }

  try {
    const updateReturn = await User.findOneAndUpdate({ _id: id }, {
      name,
      email,
      role,
      sector,
      pass: newPass,
      updatedAt: moment.utc(moment.tz('America/Sao_Paulo').format('YYYY-MM-DDTHH:mm:ss')).toDate(),
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
  const user = await User.findOne({ email: req.body.email });

  if (user == null) {
    return res.json({ message: 'The user does not exits.' });
  }

  if (await bcrypt.compare(req.body.pass, user.pass)) {
    const { id } = user;
    const token = jwt.sign({ id }, process.env.SECRET, {
      expiresIn: 240,
    });
    return res.json({ auth: true, token });
  }

  return res.json({ message: 'Incorret password.' });
};

module.exports = {
  signUpGet, signUpPost, signUpPut, signUpDelete, login,
};
