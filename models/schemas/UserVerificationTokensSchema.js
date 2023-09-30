const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');

const sequelize = require('../../config/dbConfig');
const User = require('./UserSchema');
const UserVerificatonTokens = sequelize.define('userVerificatonTokens',
  {

    generatedToken: {
      type: DataTypes.STRING,
      allowNull: false
    },
    for: {
      type: DataTypes.ENUM,
      allowNull: false,
      values: ['reset', 'verify'],
    },
    used: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    }

  },
  {
    tableName: 'user_verificaton_tokens',
    hooks: {
      // afterFind: async (userVer, _) => {
      //   if (userVer) {
      //     // if (((new Date() - userVer.createdAt) / 100 / 60 / 60) > 4) {
      //     userVer.destroy();
      //     // }
      //   }
      // }
      // afterValidate: async (userVerificatonToken, _) => {
      //   const token = userVerificatonToken.generatedToken;
      //   if (token) {
      //     const hashedToken = await bcrypt.hash(token, 10);
      //     userVerificatonToken.generatedToken = hashedToken;
      //   }
      // },
    },
  }
);



User.hasMany(UserVerificatonTokens, {
  foreignKey: {
    allowNull: false
  }
});
UserVerificatonTokens.belongsTo(User);

module.exports = UserVerificatonTokens;
