const validateEmail = (email) => {
  const regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return (regex.test(email) && email !== undefined);
};

const validateName = (name) => {
  const regex = /^[a-zA-Z ]{2,30}$/;
  return (regex.test(name) && name !== undefined);
};

const validateRole = (role) => {
  const valid = ['admin', 'professional', 'receptionist'];

  if (valid.includes(role)) {
    return true;
  }
  return false;
};

const validatePass = (pass) => {
  if (!pass || pass.length < 6) {
    return false;
  }
  return true;
};

const validate = (name, email, role) => {
  const err = [];

  if (!validateName(name)) {
    err.push('invalid name');
  } if (!validateEmail(email)) {
    err.push('invalid email');
  } if (!validateRole(role)) {
    err.push('invalid role');
  }
  return err;
};

module.exports = { validate, validatePass };
