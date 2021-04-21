const crypto = require('crypto');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const moment = require('moment-timezone');
const User = require('../Models/UserSchema');
const validation = require('../Utils/validate');
const hash = require('../Utils/hashPass');
const mailer = require('../Utils/mailer');

// ROTAS

const access = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findOne({ _id: id });
    return res.json(user);
  } catch (error) {
    return res.status(400).json(error);
  }
};

const signUpGet = async (req, res) => {
  const users = await User.find();

  return res.status(200).json(users);
};

const signUpPost = async (req, res) => {
  const {
    name, email, role, sector,
  } = req.body;
  const { transporter } = mailer;

  const temporaryPassword = crypto.randomBytes(8).toString('hex');

  transporter.sendMail({
    from: process.env.email,
    to: email,
    subject: 'Senha temporária SiGeD',
    text: `A sua senha temporária é: ${temporaryPassword}!`,
  });

  const errorMessage = validation.validate(name, email, role, sector, temporaryPassword);

  if (errorMessage.length) {
    return res.json({ message: errorMessage });
  }

  try {
    const user = await User.create({
      name,
      email,
      role,
      sector,
      pass: await hash.hashPass(temporaryPassword),
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

  const errorMessage = validation.validate(name, email, role, pass);

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
      expiresIn: 43200,
    });

    const profile = { ...user._doc };
    delete profile.pass;
    return res.json({ auth: true, token, profile });
  }

  return res.json({ message: 'Incorret password.' });
};

const recoverPassword = async (req, res) => {
  const { email } = req.body;
  const { transporter } = mailer;

  const temporaryPassword = crypto.randomBytes(8).toString('hex');

  const emailFound = await User.find({ email });

  if (emailFound.length === 0) {
    return res.status(404).json({ error: 'Could not find an user with this email' });
  }

  try {
    transporter.sendMail({
      from: process.env.email,
      to: email,
      subject: 'Senha temporária SiGeD',
      text: `A sua senha temporária é: ${temporaryPassword}!`,
    });
    return res.json({ message: 'Email sent.' });
  } catch {
    return res.status(400).json({ error: 'It was not possible to send the email.' });
  }
};

module.exports = {
  signUpGet, signUpPost, signUpPut, signUpDelete, login, access, recoverPassword,
};
