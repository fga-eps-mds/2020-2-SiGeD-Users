const request = require('supertest');
const app = require('../src/index');
const jwt = require('jsonwebtoken');

jest.mock('nodemailer', () => ({
  createTransport: jest.fn().mockReturnValue({
    sendMail: jest.fn().mockReturnValue((mailoptions, callback) => {})
  })
}));

describe('Sample Test', () => {
  let id;
  const user = {
    name: 'Jacquin',
    email: 'jacquin@gmail.com',
    role: 'admin',
    sector: '60660af3786b3c00470115c9',
  };

  const token = jwt.sign({ name: "Teste", description: "Teste" }, process.env.SECRET, {
    expiresIn: 240,
  });

  it('App is defined', (done) => {
    expect(app).toBeDefined();
    done();
  });

  it('Post user', async (done) => {
    const res = await request(app).post('/signup').set('x-access-token', token).send(user);
    expect(res.statusCode).toBe(200);
    expect(res.body.temporaryPassword).toBe(true);
    expect(res.body.name).toBe(user.name);
    expect(res.body.email).toBe(user.email);
    expect(res.body.role).toBe(user.role);
    expect(res.body.sector).toBe(user.sector);
    id = res.body._id;
    done();
  });

  it('Post user error duplicated email', async (done) => {
    const res = await request(app).post('/signup').set('x-access-token', token).send(user);
    expect(res.statusCode).toBe(400);
    expect(res.body.duplicated.email).toBe('jacquin@gmail.com');
    done();
  });

  it('Post user error', async (done) => {
    const userError = {
      name: '',
      email: '',
      role: '',
    };

    const res = await request(app).post('/signup').set('x-access-token', token).send(userError);
    expect(res.statusCode).toBe(200);
    expect(res.body.error).toEqual(['invalid name', 'invalid email', 'invalid role']);
    done();
  });

  it('Get users', async (done) => {
    const res = await request(app).get('/users').set('x-access-token', token);
    expect(res.statusCode).toBe(200);
    expect(res.body[res.body.length - 1].name).toBe(user.name);
    expect(res.body[res.body.length - 1].email).toBe(user.email);
    expect(res.body[res.body.length - 1].role).toBe(user.role);
    expect(res.body[res.body.length - 1].sector).toBe(user.sector);
    done();
  });

  it('Get user', async (done) => {
    const res = await request(app).get(`/users/${id}`).set('x-access-token', token);
    expect(res.statusCode).toBe(200);
    expect(res.body.name).toBe(user.name);
    expect(res.body.email).toBe(user.email);
    expect(res.body.role).toBe(user.role);
    expect(res.body.sector).toBe(user.sector);
    done();
  });

  it('Get user error', async (done) => {
    const res = await request(app).get('/users/12345678912345678912345').set('x-access-token', token);
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe("Invalid ID");
    done();
  });

  it('Update user', async () => {
    const userUpdate = {
      name: 'Jacquin Junior',
      email: 'jacquin2@gmail.com',
      role: 'admin',
      sector: '60660af3786b3c00470115c9',
      pass: '123456',
    };

    const res = await request(app)
    .put(`/users/update/${id}`)
    .set('x-access-token', token)
    .send(userUpdate);
    expect(res.statusCode).toBe(200);
    expect(res.body.name).toBe(userUpdate.name);
    expect(res.body.email).toBe(userUpdate.email);
    expect(res.body.role).toBe(userUpdate.role);
    expect(res.body.sector).toBe(userUpdate.sector);
  });

  it('Update user error', async () => {
    const userUpdateError = {
      name: '',
      email: '',
      role: '',
      sector: '',
    };

    const res = await request(app)
    .put(`/users/update/${id}`)
    .set('x-access-token', token)
    .send(userUpdateError);
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toEqual(['invalid name', 'invalid email', 'invalid role']);
  });

  it('Update user with invalid id', async () => {
    const userUpdateError = {
      name: 'Jacquin',
      email: 'jacquin3@gmail.com',
      role: 'admin',
      sector: '60660af3786b3c00470115c9',
      pass: '123412',
    };

    const res = await request(app)
    .put(`/users/update/1234567890987654321`)
    .set('x-access-token', token)
    .send(userUpdateError);
    expect(res.statusCode).toBe(404);
    expect(res.body.error).toBe('Invalid ID');
  });

  it('Update user without token', async () => {
    const userUpdateErrorToken = {
      name: 'Jacquin',
      email: 'jacquin4@gmail.com',
      role: 'admin',
      sector: '60660af3786b3c00470115c9',
      pass: '123321',
    };

      const res = await request(app)
      .put(`/users/update/${id}`)
      .send(userUpdateErrorToken);
      expect(res.statusCode).toBe(401);
      expect(res.body).toEqual({ auth: false, message: 'No token was provided.' });
  });

  it('Update user with invalid token', async () => {
      const tokenFalho = 'abc123';
      const userUpdateErrorToken = {
        name: 'Jacquin5',
        email: 'jacquin5@gmail.com',
        role: 'admin',
        sector: '60660af3786b3c00470105c9',
      };

      const res = await request(app)
      .put(`/users/update/${id}`)
      .set('x-access-token', tokenFalho)
      .send(userUpdateErrorToken);
      expect(res.statusCode).toBe(500);
      expect(res.body).toEqual({ auth: false, message: 'It was not possible to authenticate the token.' });
  });

  it('Recover password error', async (done) => {
    const emailForRecoverPass = {
      email: 'jacquin1@gmail.com'
    }

    const res = await request(app)
    .post(`/recover-password`)
    .set('x-access-token', token)
    .send(emailForRecoverPass);
    expect(res.statusCode).toBe(404);
    expect(res.body.error).toEqual('It was not possible to find an user with this email.');
    done();
  });

  it('Change Password', async (done) => {
    const ChangePass = {
      pass: '1234432'
    }
    const res = await request(app).put(`/change-password/${id}`).set('x-access-token', token).send(ChangePass);
    expect(res.statusCode).toBe(200);
    expect(res.body.temporaryPassword).toBe(false);
    done();
  });

  it('Change Password Error', async (done) => {
    const ChangePass = {
      pass: '17'
    }
    const res = await request(app).put(`/change-password/${id}`).set('x-access-token', token).send(ChangePass);
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe('Password too short');
    done();
  });

  it('Change Password Error id', async (done) => {
    const ChangePass = {
      pass: '1234432'
    }
    const res = await request(app).put(`/change-password/123456`).set('x-access-token', token).send(ChangePass);
    expect(res.statusCode).toBe(404);
    expect(res.body.error).toBe('It was not possible to find an user with this id.');
    done();
  });

  it('Delete user id error', async (done) => {
    const res = await request(app).delete(`/users/delete/123456789098766543`).set('x-access-token', token)
    expect(res.statusCode).toBe(404);
    expect(res.body.error).toEqual('It was not possible to find an user with this id.');
    done();
  });

  it('Delete user', async (done) => {
    const res = await request(app).delete(`/users/delete/${id}`).set('x-access-token', token)
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toEqual("User has been deleted");
    done();
  });

});

afterAll(async (done) => {
  done();
});
