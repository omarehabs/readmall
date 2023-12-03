const express = require("express");

const {
  checkoutCtrl,
  transactionCallbackCtrl,
  getTransactionCallbackCtrl,
  allUserOrdersCtrl,
} =  require("../controllers/orderControllers");

const isLoggedInAndVerified = require("../middleware/isLoggedInAndVerified");
const orderRouter = express.Router();

orderRouter.get(
  `/checkout`,
  isLoggedInAndVerified,
  checkoutCtrl
);
orderRouter.post(`/callback`, transactionCallbackCtrl);
orderRouter.get(`/callback`, getTransactionCallbackCtrl);

orderRouter.get(`/allOrders`, isLoggedInAndVerified,allUserOrdersCtrl);

module.exports = orderRouter;
