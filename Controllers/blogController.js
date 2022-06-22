const authorModel = require("../Models/authorModel")
// const blogModel = require("../Models/blogModel")
const BlogModel = require("../Models/blogModel")

const createBlog= async function (req, res) {
 try{
    let data = req.body
    let AuthorId = data.authorId

    let FindId = await authorModel.findById(AuthorId)
    if(!FindId) return res.status(400).send({status:false,msg: 'Author does not exist'})
 
    let blogCreated = await BlogModel.create(data)
    res.status(201).send({status: true,data: blogCreated})
}
catch(err){
    console.log("This is the error:", err.message)
  res.status(500).send({ msg: "Error", error: err.message })
}
}

const getAllBlogs = async function (req, res) {
    try {
      let data = req.query
      console.log(data)
      let allBlogs = await BlogModel.find(data,
        { isDeleted: false },
        { isPublished: true }
      );
      if (!allBlogs) {
        return res.status(404).send({ msg: 'please enter valid blogs' });
      }
      res.status(200).send(allBlogs);
    } catch (err) {
      res.status(500).send({ msg: 'Error', error: err.message });
    }
  };

const getBlogs = async function(res,req){
  try{

    let blogs = await BlogModel.find({isDeleted:false, isPublished:true})

    if(blogs.length === 0){
      return res.status(404).send({status:false, msg:"No data found."})
    }else{
      return res.status(200).send({status:true, data:blogs})
    }
  } catch(err){
    res.status(500).send({msg: err.message})
  }
}

module.exports.getBlogs = getBlogs













const deleteblog = async function (req, res) {
    try {
        let blogId = req.params.blogId;
        let blog = await BlogModel.findById(blogId);
        
         if (!blog) {
            return res.status(404).send({status: false,msg:"No such blog exists"});
        }

        if(await BlogModel.findByIdAndUpdate(blog, { $set: { isDeleted: true, deletedAt: Date.now() } }, { new: true }));
    
            res.status(200).send({status: true, msg: "done" });
        }
    catch (err) {
        res.status(500).send({status: false, msg: "Error", error: err.message })
    }
  
}
 
const deleteblogByQuery = async function (req, res) {
        try {
            const query = req.query
    
            let fetchdata = await BlogModel.find(query)
    
    
            if (!fetchdata) {
                return res.status(404).send({ status: false, msg: " Blog document doesn't exist " })
            }
    
            let deletedtedUser = await BlogModel.updateMany(query, { $set: { isDeleted: true, deletedAt: Date.now() } }, { new: true });
    
            res.status(200).send({status: true, msg: "done", data: deletedtedUser });
        }
        catch (err) {
            res.status(500).send({status: false, msg: "Error", error: err.message })
        }
    }
module.exports.deleteblog= deleteblog;     
module.exports.getAllBlogs=getAllBlogs   
module.exports.deleteblogByQuery=deleteblogByQuery
module.exports.createBlog= createBlog;
