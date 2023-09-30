const express = require("express");

const {
  addPublisherCtrl,
  getPublisherByIdCtrl,
  findPublisherByNameCtrl,
  updatePublisherCtrl,
  deletePublisherCtrl,
} = require("../controllers/publisherControllers");

const isLoggedInAndVerified = require("../middleware/isLoggedInAndVerified");
const isAdmin = require("../middleware/isAdmin");
const publisherRoute = express.Router();

publisherRoute.post(
  `/addPublisher`,
  isLoggedInAndVerified,
  isAdmin,
  addPublisherCtrl
);
publisherRoute.get(`/getPublisherById/:publisherId`, getPublisherByIdCtrl);
publisherRoute.get(`/getPublisherByName`, findPublisherByNameCtrl);
publisherRoute.patch(
  `/updatePublisher/:publisherId`,
  isLoggedInAndVerified,
  isAdmin,
  updatePublisherCtrl
);
publisherRoute.delete(
  `/deletePublisher/:publisherId`,
  isLoggedInAndVerified,
  isAdmin,
  deletePublisherCtrl
);

module.exports = publisherRoute;
