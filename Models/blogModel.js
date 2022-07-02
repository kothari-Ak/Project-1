const mongoose = require ("mongoose")
const ObjectId = mongoose.Schema.Types.ObjectId

const blogSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    body:{
        type:String,
        required:true
    },
    authorId:{
        type:ObjectId,
        ref:"Project_authors",
        required:true
    },
    tags: [String],
   
    category:{
        type:String,
        required:true
    },
    subCategory:[String], 
    deletedAt:{
      type:Date,
      default:null
    },
    isDeleted:{
        type:Boolean,
        default:false
    },
    
    publishedAt:{
        type:Date,
    default:null},
   
    isPublished:{ 
        type:Boolean,
        default:false
    }

}, { timestamps: true});
module.exports = mongoose.model('Project_Blog', blogSchema)
