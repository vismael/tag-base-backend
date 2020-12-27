import express from 'express';
import categoryController from '../controllers/categoryController';
import verifyToken from '../verifyToken';
// import messageModel from '../models/Messages';
import {check} from 'express-validator';




const router = express.Router();


// GET {id}
router.get('/:id', verifyToken, categoryController.categoryDetail);

// GET 
router.get('/', verifyToken,  categoryController.categoryList);

// POST
const validationCreateCateogory = [
  check('name')
    .isLength({min:1}).withMessage('the name field is required')
]


router.post('/', validationCreateCateogory, verifyToken, categoryController.categoryCreate); 

// POST request to delete message.
router.delete('/:id', verifyToken, categoryController.categoryDelete);

// PUT request to update message.
router.put('/:id', verifyToken, categoryController.categoryUpdate);



module.exports = router;