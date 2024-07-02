const bcrypt = require('bcryptjs');
const User = require("../../models/user/User");
const appErr = require('../../utils/appErr');

exports.registerCtrl = async (req, res, next)=> {
    const { fullname, email, password } = req.body;
    //check if field is empty
    if(!fullname || !email || !password)
    // return next(appErr("All field are required"));
    return res.render('users/register', {
        error: "All field are required",
    });
    try {
        //check if user exists(email)
        const userFound = await User.findOne({ email });
        //throw an err
        if(userFound) {
            return res.render('users/register', {
                error: "User already Exist, Please Log in",
            });
        }
        //hash password
        const salt = await bcrypt.genSalt(10);
        const passwordHashed = await bcrypt.hash(password, salt);
        //register user
        const user = await User.create({
            fullname,
            email,
            password: passwordHashed,
        });
        res.redirect('/api/v1/users/profile-page');
    } catch (error) {
        res.json(error);
    }
};

exports.loginCtrl = async (req, res, next)=> {
    const { email, password } = req.body;
    if(!email || !password)
    return res.render('users/login', {
        error: "Email and password fields are required",
    });
    try {
        //check if email exists
        const userFound = await User.findOne({ email });
        //throw an err
        if(!userFound) {
            return res.render('users/login', {
                error: "Invalid login Credentials",
            });
        }
        //verify password
        const isPasswordValid = await bcrypt.compare(password, userFound.password);
        //throw an err
        if(!isPasswordValid) {
            return res.render('users/login', {
                error: "Invalid login Credentials",
            });
        }
        //save the user into session
        req.session.userAuth = userFound._id;
        // console.log(req.session);
        res.redirect('/api/v1/users/profile-page');
    } catch (error) {
        res.json(error);
    }
};

exports.userDetailsCtrl = async (req, res)=> {
    // console.log(req.params);
    try {
        //get the user id
        const userID = req.params.id;
        //find the user
        const user = await User.findById(userID);
        res.render('users/updateUser', { 
            user,
            error: "",
        });
    } catch (error) {
        res.render('users/updateUser', {
            error: "",
        });
    }
};

exports.profileCtrl = async (req, res)=> {
    try {
        //get the login user
        const userID = req.session.userAuth;
        //find the user
        const user = await User.findById(userID).populate('posts').populate('comments');
        res.render('users/profile',{ user });
        console.log(user);
    } catch (error) {
        res.json(error);
    }
};

exports.uploadProfilePhotoCtrl = async (req, res, next)=> {
    // console.log(req.file);
    try {
        if(!req.file) {
            return res.render('users/uploadProfilePhoto', {
                error: "Please Upload image",
            });
        }
        //1. find the user to be updated
        const userID = req.session.userAuth;
        const userFound = await User.findById(userID);
        //2. check if user is found
        if(!userFound) {
            return res.render('users/uploadProfilePhoto', {
                error: "User not Found",
            });
        }
        //3. update profile photo
        const userUpdated = await User.findByIdAndUpdate(userID,
            {
                profileImage: req.file.path,
            },
            {
                new: true,
            });
        res.redirect('/api/v1/users/profile-page');
    } catch (error) {
        return res.render('users/uploadProfilePhoto', {
            error: error.message,
        });
    }
};

exports.uploadCoverPhotoCtrl = async (req, res)=> {
    try {
        if(!req.file) {
            return res.render('users/uploadCoverPhoto', {
                error: "Please Upload image",
            });
        }
        //1. find the user to be updated
        const userID = req.session.userAuth;
        const userFound = await User.findById(userID);
        //2. check if user is found
        if(!userFound) {
            return res.render('users/uploadCoverPhoto', {
                error: "User not Found",
            });
        }
        //3. update profile photo
        const userUpdated = await User.findByIdAndUpdate(userID,
            {
                coverImage: req.file.path,
            },
            {
                new: true,
            });
        res.redirect('/api/v1/users/profile-page');
    } catch (error) {
        return res.render('users/uploadCoverPhoto', {
            error: error.message,
        });
    }
};

exports.updatePasswordCtrl = async (req, res, next)=> {
    const { password } = req.body;
    try {
        if(!password) {
            return res.render('users/updatePassword', {
                error: "Please provide Password"
            });
        }
        //check if user is updating the password
        const salt = await bcrypt.genSalt(10);
        const passwordHashed = await bcrypt.hash(password, salt);
        //update user
        await User.findByIdAndUpdate(req.session.userAuth,  //or also use req.params.id
        {
            password: passwordHashed
        },
        {
            new: true,
        });
        res.redirect('/api/v1/users/profile-page');
    } catch (error) {
        return res.render('users/updatePassword', {
            error: error.message,
        });
    }
};

exports.updateUserCtrl = async (req, res, next)=> {
    const { fullname, email } = req.body;
    try {
        const user = await User.findById(req.session.userAuth);
        if(!fullname || !email) {
            return res.render('users/updateUser', {
                error: "Please provide details",
                user: user,
            });
        }
        //check if email is taken or not
        if(email) {
            const emailTaken = await User.findOne({ email });
            if(emailTaken) {
                return res.render('users/updateUser', {
                    error: "Email is taken",
                    user,
                });
            }
        }
        //update the user
        await User.findByIdAndUpdate(req.session.userAuth,  //or also use req.params.id
        {
            fullname,
            email,
        },
        {
            new: true,
        });
        res.redirect('/api/v1/users/profile-page');
    } catch (error) {
        return res.render('users/updateUser', {
            error: error.message,
            user: "",
        });
    }
};

exports.logoutCtrl = async (req, res)=> {
    //destroy the session
    req.session.destroy(() => {
        res.redirect('/api/v1/users/login');
    });
};