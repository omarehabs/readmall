const express = require("express");

const {
  signupCtrl,
  loginCtrl,
  getMeCtrl,
  editMyProfileCtrl,
  verfiyUserEmailCtrl,
  requestNewTokenCtrl,
  forgotPasswordCtrl,
  restorePasswordCtrl,
  resetPasswordCtrl,
} = require("../controllers/userControllers");

const isLoggedIn = require("../middleware/isLoggedIn");
const isMe = require("../middleware/isMe");

const userRoute = express.Router();

userRoute.post(`/signup`, signupCtrl);
userRoute.post(`/login`, loginCtrl);
userRoute.get(`/me`, isLoggedIn,  getMeCtrl);
userRoute.patch(`/editMyProfile`, isLoggedIn,  editMyProfileCtrl);
userRoute.get(`/verify/:userId/:verificatoionToken`, verfiyUserEmailCtrl);
userRoute.get(`/requestNewToken/:userId`, requestNewTokenCtrl);
userRoute.post(`/forgotPassword`, forgotPasswordCtrl);
userRoute.get(`/restorePassword`, restorePasswordCtrl);
userRoute.post(`/resetPassword`, resetPasswordCtrl);
// userRoute.get(`/verified`, verifiedCtrl);
// userRoute.get(`/notVerified`, notVerifiedCtrl);

module.exports = userRoute;
