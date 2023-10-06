const path = require("path");

const jwt = require("jsonwebtoken");

const {
  signupUserSchema,
  updateUserSchema,
} = require("../utils/schemaValidator/userSchemaValidator");
const { isEmail } = require("validator");
const { errorHandler } = require("../utils/errorHandler");
const successHandler = require("../utils/successHandler");
const generateToken = require("../utils/generateToken");
const User = require("../models/UserUtils");
const UserVerificationTokens = require("../models/UserVerificationTokensUtils");
const {
  sendVerificationEmail,
  sendResetPasswordEmail,
} = require("../helpers/sendEmail");
const { JWT_SECRET_KEY } = process.env;

async function signupCtrl(req, res) {
  const { value, error } = signupUserSchema.validate(req.body);
  if (error) {
    return errorHandler(res, 404, error);
  }

  try {
    const userCreated = await User.createNewUser(value);

    if (userCreated) {
      const verificationToken = generateToken();
      const verificationTokenReturned =
        await UserVerificationTokens.addVerifyToken(
          userCreated.id,
          verificationToken
        );
      //  const emailSentStatus = await sendVerificationEmail(userCreated.email, userCreated.id, verificationToken);
      // console.log(verificationTokenReturned, 'verificationTokenReturned');
      // console.log(emailSentStatus, 'emailSentStatus');
      const token = jwt.sign(
        {
          id: userCreated.id,
          role: userCreated.role,
          avatartUrl: userCreated.avatarUrl,
          fullname: userCreated.fullname,
          verified: userCreated.verified,
        },
        JWT_SECRET_KEY
      );
      return successHandler(res, 201, "User created successfuly", {
        user: userCreated,
        token,
      });
    }

    return errorHandler(res, 503, {
      message: "server error please try again later!",
    });
  } catch (e) {
    return errorHandler(res, 404, e);
  }
}

async function loginCtrl(req, res) {
  const { email, password } = req.body;
  if (!email || !email) {
    return errorHandler(res, 400, {
      message: "Both email and password are required.",
    });
  }

  if (!isEmail(email)) {
    return errorHandler(res, 404, { message: "please enter a valid email" });
  }

  try {
    const loggedUser = await User.authUser(email, password);

    if (loggedUser) {
      const token = jwt.sign(
        {
          id: loggedUser.id,
          role: loggedUser.role,
          avatartUrl: loggedUser.avatarUrl,
          fullname: loggedUser.fullname,
          verified: loggedUser.verified,
        },
        JWT_SECRET_KEY
      );

      return successHandler(res, 200, "logged in successfully.", {
        user: loggedUser,
        token,
      });
    }

    return errorHandler(res, 503, {
      message: "server error please try again later!",
    });
  } catch (e) {
    return errorHandler(res, 400, e);
  }
}

async function getMeCtrl(req, res) {
  const userId = req.userId;

  try {
    const userFound = await User.findUserById(userId);
    if (userFound) {
      return successHandler(res, 200, "Found Your profile Successfully.", {
        user: userFound,
      });
    }
    return errorHandler(res, 404, { message: "there is no user for such ID." });
  } catch (e) {
    return errorHandler(res, 400, e);
  }
}

async function editMyProfileCtrl(req, res) {
  const userId = req.userId;
  const { value, error } = updateUserSchema.validate(req.body);
  if (!userId) {
    return errorHandler(res, 404, { message: "userId is required!" });
  }
  if (error) {
    return errorHandler(res, 404, error);
  }

  try {
    const [numOfUsersUpdated, [userUpdated]] = await User.editUserData(userId, value);
    delete userUpdated["dataValues"].password;
    delete userUpdated["dataValues"].createdAt;
    delete userUpdated["dataValues"].updatedAtS;
    return successHandler(res, 200, "A user updated successfully.", {
      user: userUpdated,
      numOfUsersUpdated
    });
  } catch (e) {
    return errorHandler(res, 404, e);
  }
}

async function verfiyUserEmailCtrl(req, res) {
  const { userId, verificatoionToken } = req.params;
  try {
    const thereIsToken = await UserVerificationTokens.getUserTokens(
      userId,
      verificatoionToken
    );

    if (thereIsToken) {
      if ((new Date() - thereIsToken.createdAt) / 100 / 60 / 60 > 4) {
       // console.log(userId, verificatoionToken, "it is expired");
        // return res.redirect('localhost:3000/api/v1/users/verified');
        await thereIsToken.destroy();
        return res.send(
          "this token has been verified please request new one from your account settings"
        );
      }

      const verifiedUser = await User.verifyUser(userId);

      if (verifiedUser[0] > 0) {
        // return res.redirect('http://localhost:3000/api/v1/users/verified');
        await thereIsToken.destroy();
        return res.send("your email has been verified");
      }

      return res.send("server error please try again later");
    }
    return res.send("there is no token for such user ID");
  } catch (e) {
    return errorHandler(res, 404, e);
  }
}

async function requestNewTokenCtrl(req, res) {
  const userId = req.params.userId;
  const tokenGenerated = generateToken();
  try {
    const newVerification = await UserVerificationTokens.requestNewToken(
      userId,
      tokenGenerated
    );
    const email = await User.getEmailById(userId);
    if (!email || !newVerification) {
      return errorHandler(res, 503, {
        message: "server error please try again later",
      });
    }
    if (newVerification) {
      // const sendTokenByEmail = await sendVerificationEmail(email.email, userId, tokenGenerated);

      //   if (!sendTokenByEmail) {
      //   return errorHandler(res, 503, { message: 'server error please try again later' });
      //}

      return successHandler(
        res,
        200,
        "a new token was sent please check your inbox"
      );
    }

    return errorHandler(res, 503, {
      message: "something went wrong please try again later",
    });
  } catch (e) {
    return errorHandler(res, 400, e);
  }
}

async function forgotPasswordCtrl(req, res) {
  const email = req.body.email;
  if (!email) {
    return errorHandler(res, 404, {
      message: "email is required to reset password",
    });
  }

  try {
    const { id: userId } = await User.getIdByEmail(email);

    if (!userId) {
      return errorHandler(res, 404, { message: "no user with this email" });
    }
    const tokenForResetPassword = generateToken();
    const generatedToken = await UserVerificationTokens.addResetPasswordToken(
      userId,
      tokenForResetPassword
    );
    //    const emailSentToResetPassword = await sendResetPasswordEmail(email, userId, tokenForResetPassword);

    if (generatedToken) {
      // && emailSentToResetPassword
      return successHandler(
        res,
        200,
        "an email has been sent to reset your email password successfully",
        {
          userId,
          //  emailSentToResetPassword
        }
      );
    }

    return errorHandler(res, 503, {
      message: "server error please try again later",
    });
  } catch (e) {
    return errorHandler(res, 400, e);
  }
}

async function restorePasswordCtrl(req, res) {
  const { userId, token } = req.query;
  if (!userId || !token) {
    return errorHandler(res, 400, {
      message: "userId and token are required from query parameters",
    });
  }
  try {
    const thereIsToken = await UserVerificationTokens.checkResetTokenAndUseIt(
      userId,
      token
    );
    if (!thereIsToken) {
      return res.status(404).send("sorry but this token is missed");
    }

    if ((Date.now() - thereIsToken.createdAt) / 100 / 60 > 20) {
      await thereIsToken.destroy();
      return errorHandler(res, 400, { message: "this link has expired" });
    }
    return res
      .status(200)
      .sendFile(path.resolve(__dirname, "../static/resetPassword.html"));
  } catch (e) {
    return errorHandler(res, 400, e);
  }
}

async function resetPasswordCtrl(req, res) {
  const { token, userId, password } = req.body;
  if (!token || !userId || !password) {
    return errorHandler(res, 400, {
      message: "token, userId and password are required",
    });
  }
  try {
    const isTokenExists = await UserVerificationTokens.checkResetTokenExists(
      userId,
      token
    );

    // console.log(isTokenExists, "if ther is token for this user");
    if (!isTokenExists) {
      return errorHandler(res, 400, {
        message: "no token for such user to rest password",
      });
    }

    if ((Date.now() - isTokenExists.createdAt) / 100 / 60 > 20) {
      await isTokenExists.destroy();
      return errorHandler(res, 400, { message: "this link has expired" });
    }
    await isTokenExists.destroy();
    const updatedPassword = await User.updatePassword(userId, password);
    if (updatedPassword[0] === 1) {
      return successHandler(
        res,
        200,
        "your password has been reset please log in"
      );
    }
    return errorHandler(res, 503, {
      message: "server error please request new password to reset",
    });
  } catch (e) {
    return errorHandler(res, 400, e);
  }

  // const hashedPassword = await bcrypt.hash(password, 10);
  // user.password = hashedPassword;
}

// async function verifiedCtrl(req, res) {
//   return res.send(`
//  verified correctly
//    `);
// }

// async function notVerifiedCtrl(req, res) {
//   return res.send(`
//  an error occured please verifi again.
//   `);

// }

module.exports = {
  signupCtrl,
  loginCtrl,
  getMeCtrl,
  editMyProfileCtrl,
  verfiyUserEmailCtrl,
  requestNewTokenCtrl,
  forgotPasswordCtrl,
  restorePasswordCtrl,
  resetPasswordCtrl,
  // verifiedCtrl,
  // notVerifiedCtrl
};
