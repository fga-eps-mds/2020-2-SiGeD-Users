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
    return res.status(400).json({ error: 'Invalid ID' });
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

  const errorMessage = validation.validate(name, email, role, temporaryPassword);

  if (errorMessage.length) {
    return res.json({ error: errorMessage });
  }

  try {
    const user = await User.create({
      name,
      email,
      role,
      sector,
      pass: await hash.hashPass(temporaryPassword),
      temporaryPassword: true,
      createdAt: moment.utc(moment.tz('America/Sao_Paulo').format('YYYY-MM-DDTHH:mm:ss')).toDate(),
      updatedAt: moment.utc(moment.tz('America/Sao_Paulo').format('YYYY-MM-DDTHH:mm:ss')).toDate(),
    });

    transporter.sendMail({
      from: process.env.email,
      to: email,
      subject: 'Senha temporária SiGeD',
      text: `A sua senha temporária é: ${temporaryPassword}`,
    });
    return res.json(user);
  } catch (error) {
    return res.status(400).json({ duplicated: error.keyValue });
  }
};

const signUpPut = async (req, res) => {
  const { id } = req.params;
  const {
    name, email, role, sector,
  } = req.body;

  const errorMessage = validation.validate(name, email, role);

  if (errorMessage.length) {
    return res.status(400).json({ message: errorMessage });
  }

  try {
    const updateReturn = await User.findOneAndUpdate({ _id: id }, {
      name,
      email,
      role,
      sector,
      updatedAt: moment.utc(moment.tz('America/Sao_Paulo').format('YYYY-MM-DDTHH:mm:ss')).toDate(),
    },
    { new: true });
    return res.json(updateReturn);
  } catch (error) {
    if (error.keyValue) {
      return res.status(400).json({ duplicated: error.keyValue });
    }
    return res.status(404).json({ error: 'Invalid ID' });
  }
};

const signUpDelete = async (req, res) => {
  const { id } = req.params;

  try {
    await User.deleteOne({ _id: id });
    return res.json({ message: 'User has been deleted' });
  } catch (error) {
    return res.status(404).json({ error: 'It was not possible to find an user with this id.' });
  }
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
  let user = null;

  const temporaryPassword = crypto.randomBytes(8).toString('hex');

  try {
    user = await User.findOneAndUpdate({ email }, {
      pass: await hash.hashPass(temporaryPassword),
      temporaryPassword: true,
    }, { new: true });

    if (!user) {
      return res.status(404).json({ error: 'It was not possible to find an user with this email.' });
    }

    transporter.sendMail({
      from: process.env.email,
      to: email,
      subject: 'Senha temporária SiGeD',
      text: `A sua senha temporária é: ${temporaryPassword}`,
    });

    return res.json({ message: 'Email sent.' });
  } catch {
    return res.status(400).json({ error: 'It was not possible to send the email.' });
  }
};

const changePassword = async (req, res) => {
  const { id } = req.params;
  const {
    pass,
  } = req.body;

  const validateResult = validation.validatePass(pass);

  if (!validateResult) {
    return res.status(400).json({ error: 'Password too short' });
  }

  const newPass = await hash.hashPass(pass);

  try {
    const updateReturn = await User.findOneAndUpdate({ _id: id }, {
      pass: newPass,
      temporaryPassword: false,
      updatedAt: moment.utc(moment.tz('America/Sao_Paulo').format('YYYY-MM-DDTHH:mm:ss')).toDate(),
    },
    { new: true });
    delete updateReturn._doc.pass;
    return res.json(updateReturn);
  } catch (error) {
    return res.status(404).json({ error: 'It was not possible to find an user with this id.' });
  }
};

const newestFourUsersGet = async (req, res) => {
  const users = await User.find().limit(4).sort({ createdAt: -1 });

  return res.status(200).json(users);
};

module.exports = {
  signUpGet,
  signUpPost,
  signUpPut,
  signUpDelete,
  login,
  access,
  recoverPassword,
  changePassword,
  newestFourUsersGet,
};
