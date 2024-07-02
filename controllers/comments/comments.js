const User = require('../../models/user/User');
const Post = require('../../models/post/Post');
const Comment = require('../../models/comment/Comment');
const appErr = require('../../utils/appErr');

const createCommentCtrl = async (req, res, next)=> {
    const { message } = req.body;
    try {
        //find the post
        const post = await Post.findById(req.params.id).populate('comments').populate('user').populate({
            path: 'comments',
            populate: {
                path: 'user',
            }
        });
        //create the comment
        const comment = await Comment.create({
            user: req.session.userAuth,
            message,
            post: post._id,
        });
        //push the comment to post
        post.comments.unshift(comment._id);
        //find the user
        const user = await User.findById(req.session.userAuth);
        //push the comment to user
        user.comments.unshift(comment._id);
        //disable validation
        //save
        await post.save({ validateBeforeSave: false });
        await user.save({ validateBeforeSave: false });
        console.log(post);
        res.redirect(`/api/v1/posts/${post._id}`);
    } catch (error) {
        next(appErr(error));
    }
};

const commentDetailsCtrl = async (req, res, next)=> {
    try {
        const comment = await Comment.findById(req.params.id);
        res.render('comments/updateComment', {
            comment,
            error: "",
        });
    } catch (error) {
        res.render('comments/updateComment', {
            error: error.message,
        });
    }
};

const deleteCommentCtrl = async (req, res, next)=> {
    console.log("nhhhhhhh");
    console.log(req.query);
    try {
        //find the comment
        const comment = await Comment.findById(req.params.id);
        //check if the comment belongs to the user
        if(comment.user.toString() !== req.session.userAuth.toString()) {
            return next(appErr("You are not allowed to delete this comment",403));
        }
        await Comment.findByIdAndDelete(req.params.id);
        res.redirect(`/api/v1/posts/${req.query.postId}`);  // we need post id for this endpoint, so we passing additional arg to uri and cacn access as req.query
    } catch (error) {
        next(appErr(error));
    }
};

const updateCommentCtrl = async (req, res, next)=> {
    try {
        //find the comment
        const comment = await Comment.findById(req.params.id);
        if(!comment) {
            return next(appErr("Comment not found"));
        }
        //check if the comment belongs to the user
        if(comment.user.toString() !== req.session.userAuth.toString()) {
            return next(appErr("You are not allowed to update this comment",403));
        }
        //update
        const commentUpdated = await Comment.findByIdAndUpdate(req.params.id, {
            message: req.body.message,
        },
        {
            new: true,
        });
        res.redirect(`/api/v1/posts/${req.query.postId}`);
    } catch (error) {
        next(appErr(error));
    }
};

module.exports = {
    createCommentCtrl,
    commentDetailsCtrl,
    deleteCommentCtrl,
    updateCommentCtrl
};