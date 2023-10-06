const bcrypt = require("bcryptjs");
const User = require("./schemas/UserSchema");

User.createNewUser = async function (userData) {
  return await User.create(userData);
};

User.authUser = async function (email, password) {
  const user = await User.findOne({ where: { email } });
  if (!user) throw new Error("email or password are incorrect");

  const isPasswordMatch = await bcrypt.compare(password, user.password);
  if (!isPasswordMatch) throw new Error("email or password are incorrect");

  delete user.dataValues.password;
  return user;
};

User.findUserById = async function (userId) {
  const user = await User.findOne({ where: { id: userId } });
  if (!user) throw new Error("No user with such ID.");
  return user;
};

User.editUserData = async function (userId, changesObj) {
  return await User.update(changesObj, {
    where: {
      id: userId,
    },
    returning: true,
  });
};

User.getEmailById = async function (userId) {
  return await User.findOne({ where: { id: userId }, attributes: ["email"] });
};

User.getIdByEmail = async function (email) {
  return User.findOne({
    where: {
      email,
    },
    attributes: ["id"],
  });
};

User.updatePassword = async function (userId, password) {
  return User.update(
    { password },
    {
      where: {
        id: userId,
      },
    }
  );
};

User.verifyUser = async function (userId) {
  return User.update(
    { verified: true },
    {
      where: {
        id: userId,
      },
    }
  );
};
User.paymobBillingData = async function (userId) {
  let user = await User.findByPk(userId, {
    attributes: ["email", "fullname", "phoneNum"],
  });
  const notAvailable = "N/A";
  if (user) {
    user = user.toJSON();
    let name = user.fullname.split(" ");
    let first_name, last_name;
    if (name.length > 1) {
      first_name = name[0];
      last_name = name.slice(1).join(" ");
    }
    return {
      email: user.email, //re
      first_name, //re
      last_name, //re
      phone_number: user.phoneNum, //re
      floor: notAvailable,
      apartment: notAvailable,
      street: notAvailable,
      building: notAvailable,
      shipping_method: notAvailable,
      postal_code: notAvailable,
      city: notAvailable,
      country: notAvailable,
      state: notAvailable,
    };
  }
};
module.exports = User;
