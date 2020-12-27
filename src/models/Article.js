import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const articleSchema = new Schema({
  categories: [
    { 
      type: Schema.Types.ObjectId, 
      ref: 'Category' 
    }
  ],
  title:{
    type: String,
    default:''
  },
  description: {
    type: String,
    required: false,
    default: ''
  },
  state: {
    type: String, 
    enum: ['accomplished','pending','deprecated'],
    required: false,
    default: 'pending'
  }, 
  imgUrl :{
    type: String,
    required: false,
  },
  stars: {
    type: String,
    enum: [0,1,2,3,4,5],
    required: false,
    default: 0
  },
  public: {
    type: Boolean,
    required: false,
    default: 0
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
    type: Date,
    default : null,
  },
  created_by: {
    type: String,
    default: ''
  },



});




const articleModel = mongoose.model('Article', articleSchema);

module.exports = articleModel;