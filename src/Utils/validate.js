const validateEmail = (email) => {
  const regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return (regex.test(email) && email !== undefined);
};

const validateName = (name) => {
  const regex = /^[a-zA-Z ]{2,30}$/;
  return (regex.test(name) && name !== undefined);
};

const validateSector = (sector) => {
  const regex = /^[A-Za-záàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ ]{2,}$/;
  return (regex.test(sector) && sector !== undefined);
};

const validateRole = (role) => {
  const regex = /^[A-Za-záàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ ]{2,}$/;
  return (regex.test(role) && role !== undefined);
};

const validatePass = (pass) => {
  if(pass === undefined || pass.length < 6){
    return false;
  }
  return true;
}

const validate = (name, email, sector, role, pass) => {
  const err = [];

  if (!validateName(name)) {
    err.push('invalid name');
  } if (!validateEmail(email)) {
    err.push('invalid email');
  } if (!validateSector(sector)) {
    err.push('invalid sector');
  } if (!validateRole(role)) {
    err.push('invalid role');
  } if (!validatePass(pass)) {
    err.push('invalid pass');
  }
  return err;
};

module.exports = { validate };