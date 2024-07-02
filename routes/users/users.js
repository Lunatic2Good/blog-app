const express = require('express');
const multer = require('multer');
const userController = require('../../controllers/users/users');
const protected = require('../../middlewares/protected');
const storage = require('../../config/cloudinary');
const userRouter = express.Router();

//instance of multer
const upload = multer({ storage }); //pass incoming files

//--------
//rendering forms
//-------
//register form
userRouter.get('/register', (req, res)=>{  //------------------------ this one for client side(form)
    res.render('users/register', {
        error: "",
    });
});
//login form
userRouter.get('/login', (req, res)=>{
    res.render('users/login', {
        error: "",
    });
});
//not use same endpoint with same method(get) as it already api is there with this endpoint
//upload profile photo template
userRouter.get('/upload-profile-photo-form', (req, res)=>{
    res.render('users/uploadProfilePhoto', { error: "" });
});
//upload cover photo
userRouter.get('/upload-cover-photo-form', (req, res)=>{
    res.render('users/uploadCoverPhoto', { error: "" });
});
//update password form
userRouter.get('/update-password-form', (req, res)=>{
    res.render('users/updatePassword', { error: "" });
});


//register
userRouter.post('/register', userController.registerCtrl);   //------------ this one for api(backend)

//POST/login
userRouter.post('/login', userController.loginCtrl);

//GET/profile/ ---- for creator
userRouter.get('/profile-page', protected, userController.profileCtrl);

//PUT/profile-photo-upload/
userRouter.put('/profile-photo-upload', protected, upload.single('profile'), userController.uploadProfilePhotoCtrl);

//PUT/cover-photo-upload/
userRouter.put('/cover-photo-upload', protected, upload.single('profile'), userController.uploadCoverPhotoCtrl);

//PUT/update-password/:id
userRouter.put('/update-password', userController.updatePasswordCtrl);

//PUT/update/:id
userRouter.put('/update', userController.updateUserCtrl);

//GET/logout
userRouter.get('/logout', userController.logoutCtrl);

//GET/:id ---- for normal user
userRouter.get('/:id', userController.userDetailsCtrl);

module.exports = userRouter;