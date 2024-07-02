const User = require('../../models/user/User');
const Post = require('../../models/post/Post');
const appErr = require('../../utils/appErr');

const createPostCtrl = async (req, res, next)=> {
    const { title, description, category } = req.body;
    try {
        if(!title || !description || !category || !req.file) {
            res.render('posts/addPost', {
                error: "All fields are required",
            });
        }
        //find user
        const userID = req.session.userAuth;
        const userFound = await User.findById(userID);
        const postCreated = await Post.create({
            title,
            description,
            category,
            user: userID,
            image: req.file.path,
        });
        //push the post created into the post array of user
        userFound.posts.unshift(postCreated._id);
        await userFound.save();
        res.redirect('/');
    } catch (error) {
        res.render('posts/addPost', {
            error: error.message,
        });
    }
};

const fetchPostsCtrl = async (req, res, next)=> {
    try {
        //find user
        // const userFound = await User.findById(req.session.userAuth).populate('posts');
        const post = await Post.find().populate('comments').populate('user');
        res.json({
            status: "success",
            data: post,
        });
    } catch (error) {
        next(appErr(error.message));
    }
};

const fetchPostCtrl = async (req, res, next)=> {
    try {
        const postID = req.params.id;
        const post = await Post.findById(postID).populate({
            path: 'comments',
            populate: {
                path: 'user',
            }
        }).populate('user');
        // console.log(post);
        res.render('posts/postDetails', { 
            post,
            error: "",
        });
    } catch (error) {
        next(appErr(error.message));
    }
};

const deletePostCtrl = async (req, res, next)=> {
    try {
        //find the post
        const post = await Post.findById(req.params.id);
        //check if the post belongs to the user
        if(post.user.toString() !== req.session.userAuth.toString()) {
            return res.render('posts/postDetails', {
                error: "You are not authorized to delete this post",
                post,
            });
        }
        await Post.findByIdAndDelete(req.params.id);
        res.redirect('/');
    } catch (error) {
        return res.render('posts/postDetails', {
            error: error.message,
            post: '',
        });
    }
};

const updatePostCtrl = async (req, res, next)=> {
    const { title, description, category } = req.body;
    try {
        //find the post
        const post = await Post.findById(req.params.id);
        if(!title || !description || !category) {
            return res.render('posts/updatePost', {
                post,
                error: "All fields are required",
            });
        }
        //check if the post belongs to the user
        if(post.user.toString() !== req.session.userAuth.toString()) {
            return res.render('posts/updatePost', {
                post,
                error: "You are not authorized to update this post",
            });
        }
        //update
        //check if user is updating image or not
        if(req.file) {
            await Post.findByIdAndUpdate(req.params.id, {
                title,
                description,
                category,
                image: req.file.path,
            },
            {
                new: true,
            });
        }else {
            await Post.findByIdAndUpdate(req.params.id, {
                title,
                description,
                category,
            },
            {
                new: true,
            });
        }
        res.redirect('/');
    } catch (error) {
        res.render('posts/updatePost', {
            post: "",
            error: error.message,
        });
    }
};

module.exports = {
    createPostCtrl,
    fetchPostsCtrl,
    fetchPostCtrl,
    deletePostCtrl,
    updatePostCtrl
};