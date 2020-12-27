import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const categorySchema = new Schema({

  name:{
    type:String,
    default:''
  },
  categories: [
    { 
      type: Schema.Types.ObjectId, 
      ref: 'Category' 
    }
  ],
  description:{
    type: String,
    default: ''
  },
  fontColor:{
    type: String,
  },
  borderColor:{
    type: String,
  },
  borderRound:{
    type: Number,
    default: 0
  },
  backgroundColor:{
    type: String,
  },
  public: {
    type: Boolean,
    default: false,
  },
  created_at: {
    type: Date,
    dafault: Date.now()
  },
  updated_at: {
    type: Date,
    dafault: Date.now()
  },
  delete_at: {
    type: Date
  },
  created_by: {
    type: String,
    default: ''
  },
});


const categoryModel = mongoose.model('Category', categorySchema);

module.exports = categoryModel;