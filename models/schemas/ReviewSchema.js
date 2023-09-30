const { DataTypes } = require('sequelize');
const sequelize = require('../../config/dbConfig');
const Book = require('./BookSchema');
const User = require('./UserSchema');

const Review = sequelize.define('review', {
  rate: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      notNull: {
        msg: 'Rate can not be null.',
      },
    },
  },

  comment: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      maxLen(val) {
        if (val && val.length > 255) {
          throw new Error('Comment can not be more than 255 characters.');
        }
      },
    },
  },

},
  {
    tableName: 'reviews',
    timestamps: true,
    indexes: [
        {
            unique: true,
            fields: ['bookId', 'userId']
        },
    ]
  }
);

Book.hasMany(Review, {
  foreignKey: {
    allowNull: false
  }
});
Review.belongsTo(Book);

User.hasMany(Review, {
  foreignKey: {
    allowNull: false
  }
});
Review.belongsTo(User);


module.exports = Review;
