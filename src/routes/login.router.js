import express from 'express';
import { UserModel } from '../DAO/models/users.model.js';
import { createHash, isValidPassword } from '../utils/bcrypt.js';
import passport from 'passport';

export const loginRouter = express.Router();

loginRouter.post('/register', passport.authenticate('register', { failureRedirect: '/error-autentificacion' }), async (req, res) => {
  return res.redirect('/login');
});

loginRouter.post('/login', passport.authenticate('login', { failureRedirect: '/error-autentificacion' }), async (req, res) => {
  const user = req.user;
  console.log(user)
  if (user.username=="adminCoder@coder.com" && user.password=="adminCod3r123"){
    res.clearCookie('userId')
    res.cookie('userId', "admin", { maxAge: 3600000 });
  }

  res.clearCookie('userId')
  res.cookie('userId', user._id, { maxAge: 3600000 });    
  
  return res.redirect('/vista/products');
});

