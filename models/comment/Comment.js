const mongoose = require('mongoose');

//schema
const commentSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "User",
        },
        message: {
            type: String,
            required: true,
        },
        post: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "Post",
        },
    },
    {
        timestamps: true,
    }
);

//compile the schema to form a model
const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;