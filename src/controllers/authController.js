import userModel from '../models/User';
import bcrypt from "bcrypt";
// import bcrypt from "bcryptjs";

import jwt from 'jsonwebtoken';
import {validationResult} from 'express-validator';
import dotenv from 'dotenv';

dotenv.config();

exports.login = async (req, res) => {

    //validation
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(422).json({errors : errors.array()});
    }

    
    let username = req.body.username;
    let password=  req.body.password;

    const user = await userModel.findOne({ username })

    try {
      if (!user) return res.status(404).send({ 
        auth: false, 
        error: 'User doesn`t exist'
      });
      try {
        const match = await bcrypt.compare(password, user.password);

        if(match) {
          // create a token
          const token = jwt.sign({ id: user._id }, process.env.TOKEN_SECRET, {
              expiresIn: 86400 // expires in 24 hours
          });

          return res.status(200).send({ 
              auth: true, 
              token: { 
                  value: token, 
                  expiresIn: 86400
              },
              id: user._id,
              username : username
          });
          };

          return res.status(200).send({ 
              auth: false, 
              error : 'Incorrect password'
          });
      } catch (error) {
          return res.status(500).send({ 
            auth: false, 
            error: error
          });
        }

    } catch (error) {
      return res.status(500).send({ 
        auth: false, 
        error: error
      })

    }
}

//crear un usuario
exports.register = async (req, res) => {
    //validation
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(422).json({errors : errors.array()});
    }
    try {

        const User = new userModel({
            username : req.body.username,
            email: req.body.email,
            password: req.body.password,
        });

        const user = await User.save();
        const token = jwt.sign({ id: user._id }, process.env.TOKEN_SECRET, {
            expiresIn: 86400 // expires in 24 hours
        });

        return res.status(200).send({
            register: true,
            message: 'successfully registered',
            token: token,
            id: user._id
        });

    } catch (error) {
        res.status(400).send({ 
            register: false, 
            error: error 
        });
    }
}
