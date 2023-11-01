const { DataTypes } = require("sequelize");

const sequelize = require("../../config/dbConfig");
const Author = require("./AuthorSchema");
const Publisher = require("./PublisherSchema");
const User = require("./UserSchema");
const Category = require("./CategorySchema");

const { DEFAULT_COVER, DEFAULT_PDF } = process.env;

const Book = sequelize.define(
  "book",
  {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          msg: "Title can not be more than 120 characters",
          args: [4, 120],
        },
        notNull: {
          msg: "Book title can not be null.",
        },
      },
    },

    subTitle: {
      type: DataTypes.STRING(220),
      allowNull: true,
      defaultValue: null,
      validate: {
        len: {
          msg: "Title can not be more than 220 characters",
          args: [0, 220],
        },
      },
    },

    desc: {
      type: DataTypes.STRING(250),
      allowNull: true,
      defaultValue: "Has no description yet.",
      validate: {
        checkLen(val) {
          if (val && val.length < 1) {
            throw new Error("Description can not be more than 250 characters");
          }
        },
      },
    },

    coverUrl: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: DEFAULT_COVER,
    },

    pages: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: {
          msg: "Pages can not be less than one.",
          args: [0],
        },
        notNull: {
          msg: "Pages number can not be null.",
        },
      },
    },

    views: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: {
          msg: "views can not be less than Zero.",
          args: [0],
        },
        notNull: {
          msg: "Views number can not be null.",
        },
      },
    },

    lang: {
      type: DataTypes.ENUM,
      allowNull: false,
      defaultValue: "arabic",
      values: ["arabic", "Arabic", "English", "english"],
      validate: {
        notNull: { msg: "Language can not be null." },
      },
    },

    releaseDate: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Release Date can not be null.",
        },
      },
    },

    format: {
      type: DataTypes.ENUM,
      allowNull: false,
      defaultValue: "pdf",
      values: ["pdf", "epub", "PDF", "EPUB", "Epub", "Pdf"],
      validate: {
        notNull: { msg: "Format can not be null." },
      },
    },

    size: {
      type: DataTypes.FLOAT,
      allowNull: true,
      defaultValue: null,
      validate: {
        checkNum(val) {
          if (val && isNaN(val)) {
            throw new Error("Size can only be a number.");
          }
        },
      },
    },

    copyright: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      validate: {
        notNull: {
          msg: "Copyright can not be null.",
        },
      },
    },

    toBuy: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      validate: {
        notNull: {
          msg: "toBuy can not be null.",
        },
        notEmpty: {
          msg: "toBuy can not be null.",
        },
      },
    },

    bookUrl: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: DEFAULT_PDF,
    },

    price: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: null,
      validate: {
        checkNum(val) {
          if (val && isNaN(val)) {
            throw new Error("Size can only be a number.");
          }
        },
      },
    },
  },

  {
    hooks: {
      afterFind: async (books, {}) => {
        if (books && !Array.isArray(books)) {
          books.toJSON();
          delete books.dataValues.updatedAt;
          delete books.dataValues.createdAt;
          // await books.update({ ...books, views: books.views + 1 });
        }
        if (Array.isArray(books)) {
          // if (books.length > 0) {
          //   for (const p of books) {
          //     p.toJSON();
          //   }
          // }
        }
      },
      beforeValidate: async function (book, _) {
        book.dataValues.format = book.dataValues.format.toLowerCase();
        book.dataValues.lang = book.dataValues.lang.toLowerCase();
      },
    },
    tableName: "books",
  }
);

Author.hasMany(Book, {
  foreignKey: {
    allowNull: false,
  },
});
Book.belongsTo(Author);

User.hasMany(Book, {
  foreignKey: {
    allowNull: false,
    name: "uploaderId",
  },
});
Book.belongsTo(User, {
  foreignKey: {
    allowNull: false,
    name: "uploaderId",
  },
});

Publisher.hasMany(Book, {
  foreignKey: {
    allowNull: false,
  },
});
Book.belongsTo(Publisher);

Category.hasMany(Book, {
  foreignKey: {
    allowNull: false,
  },
});
Book.belongsTo(Category);

module.exports = Book;
