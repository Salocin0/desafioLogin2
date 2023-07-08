import express from 'express';
import { UserModel } from '../DAO/models/users.model.js';
import { createHash, isValidPassword } from '../utils/bcrypt.js';

export const loginRouter = express.Router();

loginRouter.post('/register', async (req, res) => {
  const { firstName, lastName, age, email, password,rol="Usuario" } = req.body;
  if (!firstName || !lastName || !age || !email || !password) {
    return res.status(400).render('error-page', { msg: 'faltan datos' });
  }
  try {
    await UserModel.create({ firstName, lastName, age, email, password:createHash(password),rol});
    req.session.firstName = firstName;
    req.session.email = email;
    return res.redirect('/login');
  } catch (e) {
    console.log(e);
    return res.status(400).render('error-page', { msg: 'controla tu email y intenta mas tarde' });
  }
});

loginRouter.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).render('error-page', { msg: 'faltan datos' });
  }
  if (email=="adminCoder@coder.com" && password=="adminCod3r123"){
    res.clearCookie('userId')
    res.cookie('userId', "admin", { maxAge: 3600000 });
    return res.redirect('/vista/products');
  }
  try {
    const foundUser = await UserModel.findOne({ email });
    if (foundUser && isValidPassword(password,foundUser.password)) {
      req.session.firstName = foundUser.firstName;
      req.session.email = foundUser.email;
      req.session.admin = foundUser.admin;
      res.clearCookie('userId')
      res.cookie('userId', foundUser._id, { maxAge: 3600000 });
      return res.redirect('/vista/products');
    } else {
      return res.status(400).render('error-page', { msg: 'email o pass incorrectos' });
    }
  } catch (e) {
    console.log(e);
    return res.status(500).render('error-page', { msg: 'error inesperado en servidor' });
  }
});

