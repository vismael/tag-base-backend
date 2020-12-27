import articleModel from '../models/Article';
import userModel from '../models/User';
import categoryModel from '../models/Category';

import {validationResult} from 'express-validator';

import jwt from 'jsonwebtoken';


import dotenv from 'dotenv';

dotenv.config();

// GET {id}
exports.articleDetail = async (req, res) => {
  try {
    const idArticle = req.params.id;

    const article =
      await articleModel
        .findById(idArticle)
        .populate('categories');

    if (article.delete_at == null){
      res.status(200).json(article);
    }else{
      res.status(403).send({
        success:false,
        error: 'article deleted'
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
exports.articleList = async (req, res) => {

  try {
    
    let query = articleModel.find({}).populate('categories');
    // use limit
    let limit = parseInt(req.query.limit);
    if (req.query.limit == undefined){
      query.limit(30)
    }else{
      query.limit(limit)
    }
    // skip
    let skip = parseInt(req.query.skip);
    if (req.query.skip == undefined){
      query.skip(0)
    }else{
      query.skip(skip)
    }


    let search = req.query.search;
    if (req.query.search != undefined){
      search.trim()
      query.find({ "title": { "$regex": search, "$options": "i" } })
    }

    

    if (req.query.categories != undefined){
      const categories = req.query.categories.split(',');
      // tal vez no buscar por id, sino por name?
      query.find({ categories : { $all : categories }});
    }

    

    let description = req.query.description;
    if (req.query.description != undefined){
      query.find({ "description": { "$regex": description, "$options": "i" } })
    }

    let type = req.query.type;
    if (req.query.type != undefined){
      query.find({"type": type})
    }

    let state = req.query.state;
    if (req.query.type != undefined){
      query.find({"state": state})
    }

    let stars = req.query.stars;
    if (req.query.stars != undefined){
      query.find({"stars": stars})
    }
    
    query.find({'delete_at': null}).populate('categories')
    
    const articles = await query.exec();
    res.status(200).json(articles);
  } catch (error) {
    res.status(400).send({ 
      success: false,
      error: error
    });
  }
}


// POST 
exports.articleCreate = async (req, res) => { 
  //validacion
  const errors = validationResult(req);
  if(!errors.isEmpty()){
    return res.status(422).json({errors : errors.array()});
  }
  try {
        
    const usertoken = req.headers['x-access-token'];
    const decoded = jwt.verify(usertoken, process.env.TOKEN_SECRET);
    const userIdFromToken = decoded.id;
    //push extra data to body.
    req.body.updated_at = Date.now();
    req.body.created_at = Date.now();
    req.body.created_by = userIdFromToken;

    const Article = new articleModel(req.body);


    const article = await Article.save();

    //save  user reference
    const user = await userModel.findOne({ _id: userIdFromToken });
    user.articles.push(article._id);
    user.save();
  


    res.status(200).send({article})
  } catch (error) {
    res.status(400).send({ 
      create: false, 
      error: error 
    });
  }
  
}


// DELETE
exports.articleDelete = async (req, res) => { 
  try {
    const usertoken = req.headers['x-access-token'];
    const decoded = jwt.verify(usertoken, process.env.TOKEN_SECRET);
    const userIdFromToken = decoded.id;
    const idArticle = req.params.id;

    // const article = await articleModel.findOneAndRemove({ _id: idArticle });

    const article = await articleModel.findById({ _id : idArticle});

    if (article == null) 
      return res.status(404).send({
        delete: false,
        error: 'this article does not exist.'
      });
    
    const articleUpdate = await articleModel.update({ _id: idArticle, created_by: userIdFromToken },{
      $set: {
        'delete_at': Date.now(),
      }
    });
    
    if (articleUpdate == null) 
      return res.status(404).send({
        delete: false,
        error: 'this article does not exist.'
    });
    
    let response = {
      delete:true,
      message : 'this article has been successfully deleted',
      value : {id : idArticle, title : article.title}
    }
    return res.status(200).json(response);

  } catch (error) {
    res.status(400).send({ 
      delete: false, 
      error: error 
    });
  }
}

// PUT request to update article
exports.articleUpdate = async (req, res) => {

  try {
    const article = await articleModel.findByIdAndUpdate(
      { _id: req.params.id },
      { $set: Object.assign(req.body) },
      { new: true },
    ).populate('categories')
    res.status(200).json(article);
  }
  catch (error) {
    res.status(400).send({
      update: false,
      error: error
    });
  }
}