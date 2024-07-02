const mongoose = require('mongoose');

//title, desc, catrgory, image
const postSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        category: {
            type: String,
            required: true,
            enum: ["html", "css", "javascript", "mongoDB", "express", "react js", "node js", "other"],
        },
        image: {
            type: String,
            required: true,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        comments: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment",
        }],
    },
    {
        timestamps: true,
    }
);

//compile the schema to form a model
const Post = mongoose.model("Post", postSchema);

module.exports = Post;