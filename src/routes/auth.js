import express from "express";
import authController from "../controllers/authController";
import {check} from 'express-validator';
import userModel from '../models/User';
import { body } from 'express-validator';

const Router = express.Router();


const validationLoginUser = [
    check('username','the email field is required').isLength({min:1}),
    check('password','your password have a minimum of 6 characters').isLength({min:6}),
  ]

  const validationRegisterUser = [
    check('email','the email must be a valid email address').isEmail(),
    check('email','the email field is required').isLength({min:1}),
    check('username','the email field is required').isLength({min:1}),
    check('password','your password have a minimum of 6 characters').isLength({min:6}),
    body('passwordConfirmation').custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Password confirmation does not match password');
      }else{
        return true
      }
    }),
    check('email').custom(value => {
      return userModel.findOne({email: value}).then(user => {
        if (user) {
          return Promise.reject('E-mail already in use');
        }
      });
    }),
    check('username').custom(value => {
      return userModel.findOne({username: value}).then(user => {
        if (user) {
          return Promise.reject('Username already in use');
        }
      });
    }),
  ]


Router.post('/login',validationLoginUser , authController.login);
Router.post('/register', validationRegisterUser, authController.register);

module.exports = Router;