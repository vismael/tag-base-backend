import userModel from '../models/User';
import articleModel from '../models/Article';

import {validationResult} from 'express-validator';


// GET
exports.userList = async (req, res) => {
  try {
    const users =
      await userModel
        .find({})
        .select("-password")
        .populate('articles categories')
    res.status(200).json(users);
  } catch (error) {
    res.status(400).send({ message: 'error', error });
  }
}

// GET {id}
exports.userDetail = async (req, res) => {
  const idUser = req.params.id;

  try {
    const user =
      await userModel
        .findById(idUser)
        .select("-password")
        .populate('articles categories')
    res.status(200).json(user);
  } catch(error) {
    res.status(400).send({ message: 'error', error });
  }
}

// POST
exports.userCreate = async (req, res) => {
  try {

    const errors = validationResult(req);
    if(!errors.isEmpty()){
       return res.status(422).json({errors : errors.array()});
    }

    const User = new userModel({
      email: req.body.email,
      password: req.body.password,
    });
      
    const user = await User.save();
    
    res.status(200).json(user);
  } catch (error) {
    res.status(400).send({ message: 'error al crear usuario', error });
  }
}

// DELETE
exports.userDelete = async (req, res) =>{
  try {
    const idUser = req.params.id;

    const user = await userModel.findOneAndRemove({ _id: idUser });
    res.status(200).json(user);
  } catch (error) {
    res.status(400).send({ message: 'error', error });
  }
}

// PUT
exports.userUpdate = async (req, res) => {
  try {
    const user = await userModel.findByIdAndUpdate(
      { _id: req.params.id },
      { $set: Object.assign(req.body) },
      { new: true },
    )
    res.status(200).json(user);
  }
  catch(error) {
    res.status(400).send({ message: 'error', error });
  }
  
}
