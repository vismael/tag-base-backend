import categoryModel from '../models/Category';
import {validationResult} from 'express-validator';
import userModel from '../models/User';
import jwt from 'jsonwebtoken';

import dotenv from 'dotenv';

dotenv.config();


// GET {id}
exports.categoryDetail = async (req, res) => {
  try {
    //recupero el id pasado por param
    const idCategory = req.params.id;
    const category = await categoryModel.findById(idCategory);

    if (category.delete_at == null){
      res.status(200).json(category);
    }else{
      res.status(403).send({
        success:false,
        error: 'category deleted'
      })
    }
    
  } catch (error) {
    res.status(400).send({ 
      success: false, 
      error: error 
    });
  }
}

// GET
exports.categoryList = async (req, res) => {
  
  let query = categoryModel.find({'delete_at': null});
  
  // const usertoken = req.headers['x-access-token'];
  // const decoded = jwt.verify(usertoken, config.secret);
  // const userIdFromToken = decoded.id;
  // // query.find({"receiver": userIdFromToken });
  try {
    const category = await query.exec();;
    res.status(200).json(category);
  } catch (error) {
    res.status(400).send({ 
      success: false,
      error: error
    });
  }
}


// POST
exports.categoryCreate = async (req, res) => { 

  //validacion
  const errors = validationResult(req);
  if(!errors.isEmpty()){
    return res.status(422).json({errors : errors.array()});
  }
  
  try {
    const usertoken = req.headers['x-access-token'];
    const decoded = jwt.verify(usertoken, process.env.TOKEN_SECRET);
    const userIdFromToken = decoded.id;
    
    
    req.body.updated_at = Date.now();
    req.body.created_at = Date.now();
    
    req.body.sender = userIdFromToken;
    
    const Category = new categoryModel(req.body);
    const category = await Category.save();
    
    const user = await userModel.findOne({ _id: userIdFromToken });
    
    
    user.categories.push(category._id);
    user.save();
    
    res.status(200).send({category})
    
  } catch (error) {
    res.status(400).send({ 
      create: false, 
      error: error 
    });
  }

}

// DELETE
exports.categoryDelete = async (req, res) => { 
  try {
    //recupero el id pasado por param
    const idCategory = req.params.id;

    const category = await categoryModel.findOneAndRemove({ _id: idCategory }).populate('categories')  ;

    if (category == null) 
      return res.status(200).send({
        delete: false,
        error: 'this category does not exist.'
      });


    let response = {
      delete:true,
      message : 'This category has been successfully deleted',
      value : {id : idCategory}
    }
    return res.status(200).json(response);

  } catch (error) {
    res.status(400).send({ 
      delete: false, 
      error: error 
    });
  }
}

// PUT request to update message
exports.categoryUpdate = async (req, res) => {
  try {
    const category = await categoryModel.findByIdAndUpdate(
      { _id: req.params.id },
      { $set: Object.assign(req.body) },
      { new: true },
    ).populate('categories') 
    res.status(200).json(category);
  }
  catch (error) {
    res.status(400).send({
      update: false,
      error: error
    });
  }
}