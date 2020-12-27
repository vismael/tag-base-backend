import mongoose from 'mongoose';
import bcrypt from "bcrypt";
import uniqueValidator from 'mongoose-unique-validator';
var Schema = mongoose.Schema;

var userSchema = new Schema({
  articles: [
    { 
      type: Schema.Types.ObjectId, 
      ref: 'Article' 
    }
  ],
  categories: [
    { 
      type: Schema.Types.ObjectId, 
      ref: 'Category' 
    }
  ],
  username: {
    type: String,
    //required: true,
    //unique: true
  },
  password: { 
    type: String,
    required: true
  },
  permission: {
    type: String,
    required: false,
    default: ''
  },
  name: { 
    type: String,
    required: false,
    default: ''
  },
  email: { 
    type: String,
    required: false,
    unique: true // with this: (node:15680) DeprecationWarning: collection.ensureIndex is deprecated. Use createIndexes instead.
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
});

userSchema.plugin(uniqueValidator);
 
userSchema.pre('save', async function(next){
  // if(!this.isModified("password")){
  if ( this.password && this.isModified('password') ) { 
    try{
      console.log('tessssssssssst')
      // salt is random data that is used as an additional input that hash password
      let salt = await bcrypt.genSalt(10);
      let hashedPassword = await bcrypt.hash(this.password, salt);

      this.password = hashedPassword;
      next();

    }catch(error){
      next(error);
    }
  }
  next();
});




const userModel = mongoose.model('User', userSchema);

module.exports = userModel;