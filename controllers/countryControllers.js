const Country = require('../models/CountryUtils');
const {errorHandler} = require('../utils/errorHandler');
const successHandler = require('../utils/successHandler');

async function addCountryCtrl(req, res) {
  const { country } = req.body;
  if (!country) {
    errorHandler(res, 404, { message: "country name is required!" });
  }

  try {
    const countryAdded = await Country.addCountry(country);
    if (countryAdded) {
      return successHandler(res, 201, 'State added successfully.', { country: countryAdded });
    }

    return errorHandler(res, 503, { message: 'server error please try again later' });
  } catch (e) {
    return errorHandler(res, 400, e);
  }
}

module.exports = {
  addCountryCtrl,
};
