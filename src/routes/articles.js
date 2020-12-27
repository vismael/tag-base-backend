import express from 'express';
import articleController from '../controllers/articlesController';
import verifyToken from '../verifyToken';
import articleModel from '../models/Article';
import {check} from 'express-validator';


const router = express.Router();

// GET request for one article
router.get('/:id', articleController.articleDetail);

// GET request for all article.
router.get('/', articleController.articleList);

// POST request create article
const validationCreateArticle = [
  check('title')
    .isLength({min:1}).withMessage('the title field is required')
    .isLength({max:250}).withMessage('title is too long'),
  check('content')
    .isLength({max:1650}).optional().withMessage('content is too long'),
  check('state')
    .optional()
    .isIn(['accomplished','pending','deprecated']).withMessage('state not in value list'),
  check('stars')
    .optional()
    .isIn([0,1,2,3,4,5]).withMessage('stars not in value list'),
]

router.post('/' , validationCreateArticle, verifyToken, articleController.articleCreate); 

// POST request to delete article.
router.delete('/:id', verifyToken, articleController.articleDelete);

// PUT request to update article.
router.put('/:id', verifyToken, articleController.articleUpdate);



module.exports = router;