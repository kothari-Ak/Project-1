const jwt = require("jsonwebtoken");
const BlogModel = require("../Models/blogModel")


 //==================== [Authentication Middleware]===============================

const Authentication = function (req, res, next) {
    try {
    token = req.headers["x-api-key"];
    if (!token) return res.status(400).send({ status: false, msg: "token must be present " })
  
    jwt.verify(token, "aishwarya-anugya-anjali-kimmi",function(err,data){
        if(err) return res.status(401).send({status:false, msg:"token is not valid"})
    
    else {req.authordata = data}
    // console.log(data) 
    next()
    }) 
    } catch (err) {
        res.status(500).send({ status: false, msg: "Error", error: err.message })
    }
}
module.exports.Authentication = Authentication

//=================[Authorisation Middleware]============================

const Authorisation = async function (req, res, next) { 
    try {
        let token = req.headers["x-api-key"]
        console.log("hii")
        if (!token) return res.status(400).send({ status: false, msg: "token must be present " })
        let decodedToken = jwt.verify(token, "aishwarya-anugya-anjali-kimmi")
        
        let blogId = req.params.blogId
 
        let blog = await BlogModel.findById({_id : blogId})
    
      if (!blog) {
        return res.status(404).send({ status: false, msg: "No such blog exists" });
    }
    
        let authorLogin = decodedToken.authorId
    
        if ( blog.authorId != authorLogin) 
            return res.status(403).send({ status: false, msg: 'You are not authorized.' })
        next()
    }
    catch (err) {
        res.status(500).send({ msg: "Error", error: err.message })
    }
};
module.exports.Authorisation = Authorisation ;

//=================[Authorisation Middleware]============================

const deleteByQuery = async function (req,res,next){
    try {
        let token = req.headers["x-api-key"]
        
        if (!token) return res.status(400).send({ status: false, msg: "token must be present " })
        let decodedToken = jwt.verify(token, "aishwarya-anugya-anjali-kimmi")

        let authorId = req.query.authorId

        if ( authorId && !mongoose.Types.ObjectId.isValid(authorId) ) 
        return res.status(400).send({ status: false, msg: "authorId is invalid."})

        if ( authorId && authorId !== decodedToken.authorId )
         return res.status(400).send({ status: false, msg: "You are not authorized to delete these blogs. authorId doesn't belong to you."})

        req.authorId = decodedToken.authorId
        next()
    } catch (err) {
        return res.status(500).send({ status: false, msg: err.message })
    }

}
module.exports.deleteByQuery = deleteByQuery ;