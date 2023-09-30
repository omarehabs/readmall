const Country = require('./schemas/CountrySchema');

Country.addCountry = async function (country) {
  return await Country.create({ country });
};

module.exports = Country;
