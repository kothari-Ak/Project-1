const authorModel = require("../Models/authorModel")
const BlogModel = require("../Models/blogModel")

// ========================[Validations]==================================
const isValid = function (value) {
    if( typeof value ==='undefined' || value === null ) {
        // console.log("1")
          return false
        }

    if( typeof value == 'string' && value.trim().length == 0 ) {
    //   console.log("2")
        return false
    }
    if ( typeof value == 'string' && value.length !== value.trim().length ) {
    //   console.log("3")
        return false
    }
    if ( typeof value == 'number' ) {
      // console.log("4")
        return false
    }
    return true
  }
// ========================[CreateBlog]==================================

const createBlog = async function (req, res) {
    try {
        let data = req.body
        
        const { title, body, authorId,tags, category,subCategory  } = data;

        if (Object.keys(data).length == 0) {
            return res.status(400).send({ status: false, msg: "Body should  be not Empty.. " })
        }
    
        let inValid = ' '
        if ( !isValid ( title ) ) inValid = inValid + "title "
        if ( !isValid ( body ) ) inValid = inValid + "body "
        if ( !isValid ( authorId ) ) inValid = inValid + "authorId "
        if ( !isValid ( tags ) ) inValid = inValid + "tags "
        if ( !isValid ( category ) ) inValid = inValid + "category "
        if ( !isValid ( subCategory ) ) inValid = inValid + "subCategory "
        if ( !isValid(title) || !isValid(body) ||!isValid(authorId) || !isValid(tags) || !isValid(category) || !isValid(subCategory) ) {
            return res.status(400).send({ status: false, msg: `Enter valid details in following field(s): ${inValid}` })
        }
    
        let AuthorId = data.authorId
        
        let FindId = await authorModel.findById(AuthorId)
        if (!FindId) return res.status(400).send({ status: false, msg: 'AuthorId does not exist' })

        let blogCreated = await BlogModel.create(data)
        res.status(201).send({ status: true, data: blogCreated })
    }
    catch (err) {
        res.status(500).send({ msg: "Error", error: err.message })
    }
}
// ========================[getAllBlogs]==================================

const getAllBlogs = async function (req, res) {
    try {
        let q = req.query;
        let filter = {
            ...q,
            isDeleted: false,
            isPublished: true
        };

        const data = await BlogModel.find(filter);
        // console.log(data)
        if (data.length == 0) return res.status(404).send({ status: false, msg: "No blog is found" });

        res.status(200).send({ status: true, data: data })
    } catch (err) {
        res.status(500).send({ status: false, msg: err.message });
    }
};
// ========================[updateBlog]==================================

const updateBlog = async function (req, res) {
    try {
        let data = req.body;
        let blogId = req.params.blogId;

        if (Object.keys(data).length == 0) {
            return res.status(400).send({ status: false, msg: "Body should not be Empty.. " })
        }

        let blog = await BlogModel.findOneAndUpdate({_id : blogId, isDeleted:false},
               {
                 $set: {isPublished:true , body: data.body, title:data.title, publishedAt: new Date()},
                $push: {tags: data.tags, subCategory:data.subCategory }
            },
            {new : true});

        res.status(200).send({ status: true, data: blog });
    }
    catch (err) {
        res.status(500).send({ status: false, msg: "Error", error: err.message })
    }
}
// ========================[deleteblog]==================================

const deleteblog = async function (req, res) {
    try {
        let blogId = req.params.blogId;

        let blog = await BlogModel.findById({_id:blogId, isDeleted:false, deletedAt:null});
       
        if (!blog) {
            return res.status(404).send({ status: false, msg: "No such blog exists" });
        }
        if (blog.isDeleted == true) {
            return res.status(400).send({ status: false, msg: "Already Deleted " })
        }

        if (await BlogModel.findByIdAndUpdate({_id : blogId}, { $set: { isDeleted: true, deletedAt: Date.now() } }, { new: true }));

        res.status(200).send();
    }

    catch (err) {
        res.status(500).send({ status: false, msg: "Error", error: err.message })
    }
}
// ========================[deleteblogByQuery]==================================

const deleteblogByQuery = async function (req, res) {
    try {
        let data = req.query
        data.authorId = req.authorId
        
        let mandatory = {
             isDeleted: false,
             isPublished: false, 
              ...data
             };

        let findBlogs = await BlogModel.find( mandatory )
        if ( findBlogs.length === 0 )
         return res.status(400).send({ status: false, msg: "No such blog found to delete." })

        let deleted = await BlogModel.updateMany( mandatory, { isDeleted: true, deletedAt: new Date() }, { new: true } )
        return res.status(200).send({ status: true, data: deleted })
    }
     catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}

module.exports.createBlog = createBlog;
module.exports.getAllBlogs = getAllBlogs;
module.exports.updateBlog = updateBlog;
module.exports.deleteblog = deleteblog;
module.exports.deleteblogByQuery = deleteblogByQuery;
