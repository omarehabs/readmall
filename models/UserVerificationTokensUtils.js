const UserVerificationTokens = require('./schemas/UserVerificationTokensSchema');

UserVerificationTokens.addVerifyToken = async function (userId, generatedToken,) {
    return await UserVerificationTokens.create({
        generatedToken,
        userId,
        for: 'verify'
    });

};

UserVerificationTokens.requestNewToken = async function (userId, generatedToken,) {
    const tokens = await UserVerificationTokens.findAll({
        where: {
            userId,
            for: 'verify'
        }
    });

    if (tokens.length > 0) {
        if (tokens.length > 1) {
            tokens.forEach((token) => {
                token.destroy();
            });
        }
        tokens[0].destroy();
    }


    return await UserVerificationTokens.create({
        generatedToken,
        userId,
        type: 'verify'
    });

};

UserVerificationTokens.getUserTokens = async function (userId, token) {

    return await UserVerificationTokens.findOne({
        where: {
            userId, generatedToken: token,
            for: 'verify'
        }
    });
};

UserVerificationTokens.deleteToken = async function (tokenId) {
    return UserVerificationTokens.destroy({
        where: {
            id: tokenId,
            for: 'verify'
        },

    });
};

UserVerificationTokens.addResetPasswordToken = async function (userId, token) {
    await UserVerificationTokens.destroy({
        where: {
            userId,
            for: 'reset'
        }
    });
    return await UserVerificationTokens.create({
        generatedToken: token,
        userId,
        for: 'reset',
        used: false
    });

};

UserVerificationTokens.checkResetTokenAndUseIt = async function (userId, token) {
    const resetToken = await UserVerificationTokens.findOne({
        where: {
            userId,
            generatedToken: token,
            used: false,
            for: 'reset'
        }
    });

    if (resetToken) {
        resetToken.update({ used: true });
        return true;
    }

    return false;
};

UserVerificationTokens.checkResetTokenExists = async function (userId, token) {
    return await UserVerificationTokens.findOne({
        where: {
            userId,
            generatedToken: token,
            used: true,
            for: 'reset'
        },
    });
};


module.exports = UserVerificationTokens;