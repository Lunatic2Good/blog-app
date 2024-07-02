const express = require('express');
const {
    createCommentCtrl,
    commentDetailsCtrl,
    deleteCommentCtrl,
    updateCommentCtrl
} = require('../../controllers/comments/comments');
const protected = require('../../middlewares/protected');
const commentRouter = express.Router();

//POST/api/v1/comments/
commentRouter.post('/:id', protected, createCommentCtrl);

//GET/api/v1/comments/:id
commentRouter.get('/:id', commentDetailsCtrl);

//DELETE/api/v1/comments/:id
commentRouter.delete('/:id', protected, deleteCommentCtrl);

//PUT/api/v1/comments/:id
commentRouter.put('/:id', protected, updateCommentCtrl);

module.exports = commentRouter;