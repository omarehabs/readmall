const express = require("express");

const { addCountryCtrl } = require("../controllers/countryControllers");
const isLoggedInAndVerified = require("../middleware/isLoggedInAndVerified");
const isAdmin = require("../middleware/isAdmin");

const stateRoute = express.Router();

stateRoute.post(`/addCountry`, isLoggedInAndVerified, isAdmin, addCountryCtrl);

module.exports = stateRoute;
