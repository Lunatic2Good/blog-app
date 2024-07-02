const express = require('express');
const multer = require('multer');
const {
    createPostCtrl,
    fetchPostsCtrl,
    fetchPostCtrl,
    deletePostCtrl,
    updatePostCtrl
} = require('../../controllers/posts/posts');
const protected = require('../../middlewares/protected');
const storage = require('../../config/cloudinary');
const Post = require('../../models/post/Post');
const postRouter = express.Router();

//instance of multer
const upload = multer({ storage });

//create post form
postRouter.get('/get-post-form', (req, res)=>{
    res.render('posts/addPost', { error: "" });
});

//update post form
postRouter.get('/get-form-update/:id', async (req, res)=>{
    try {
        const post = await Post.findById(req.params.id);
        res.render('posts/updatePost', { 
            post,
            error: "",
        });
    } catch (error) {
        res.render('posts/updatePost', { 
            post: "",
            error,
        });
    }
});

//POST/api/v1/posts
postRouter.post('/', protected, upload.single('file'), createPostCtrl);

//GET/api/v1/posts
postRouter.get('/', fetchPostsCtrl);

//GET/api/v1/posts/:id
postRouter.get('/:id', fetchPostCtrl);

//DELETE/api/v1/posts/:id
postRouter.delete('/:id', protected, deletePostCtrl);

//PUT/api/v1/posts/:id
postRouter.put('/:id', protected, upload.single('file'), updatePostCtrl);

module.exports = postRouter;