const Cart = require("../models/CartUtils");
const Order = require("../models/OrderUtils");
const OrderBook = require("../models/OrderBookUtils");
const User = require("../models/UserUtils");
const { errorHandler, serverError } = require("../utils/errorHandler");
const successHandler = require("../utils/successHandler");
const sequelize = require("../config/dbConfig");
const handleNumOfPages = require("../utils/handleNumOfPages");
const {
  getToken,
  getOrderId,
  getPaymenyToken,
  calculateHmac,
} = require("../helpers/paymob");
const UserBook = require("../models/UserBookUtils");

const {
  PAYMOB_API_KEY,
  PAYMOB_INTEGRATION_ID,
  PAYMOB_HMAC,
  PAYMOB_IFRAME_LINK,
  PAYMOB_IFRAME_CARD_INTEGRATION_NUMBER,
} = process.env;

async function checkoutCtrl(req, res) {
  const userId = req.userId;
  const t = await sequelize.transaction();
  try {
    const paymobBillingData = await User.paymobBillingData(userId);
    const cartBooksToBuy = await Cart.getAllCartBooksToCheckout(userId);
    const paymobOrderItems = cartBooksToBuy.map((bookItem) => {
      return {
        name: bookItem.title,
        amount_cents: bookItem.price,
        description: bookItem.desc,
        quantity: 1,
      };
    });

    if (paymobOrderItems.length === 0 || cartBooksToBuy.length === 0) {
      return errorHandler(res, 400, { message: "no cart items to pay for" });
    }

    if (!paymobBillingData["phone_number"]) {
      return errorHandler(res, 400, {
        message:
          "phoneNum is required to pay for your orders please provide one",
      });
    }

    const order = await Order.createOrder(cartBooksToBuy, userId, t);
    console.log(order.toJSON(), 'local order')
    if (!order["id"]) {
      return errorHandler(res, 400, {
        message: "something went wrong with order Id",
      });
    }

    const paymobToken = await getToken(PAYMOB_API_KEY);
    if (typeof paymobToken !== "string") {
      return errorHandler(res, 400, {
        message: paymobToken,
      });
    }

    const paymobOrderId = await getOrderId(
      paymobOrderItems,
      order.id,
      order.totalAmountInCents,
      order.currency,
      paymobToken
    );

    if (isNaN(parseInt(paymobOrderId))) {
      return errorHandler(res, 400, {
        message: paymobOrderId,
      });
    }

    const paymobPaymentToken = await getPaymenyToken(
      order.totalAmountInCents,
      paymobToken,
      3600,
      paymobOrderId,
      order.currency,
      paymobBillingData,
      PAYMOB_INTEGRATION_ID
    );

  if (typeof paymobPaymentToken !== "string") {
      return errorHandler(res, 400, {
        message: paymobToken,
      });
    }
    await t.commit();
   return res.send(
      `${PAYMOB_IFRAME_LINK}/${PAYMOB_IFRAME_CARD_INTEGRATION_NUMBER}?payment_token=${paymobPaymentToken}`
    );
  } catch (e) {
    await t.rollback();
    // return errorHandler(res, 400, e);
    return res.send(e);
  }
}

async function transactionCallbackCtrl(req, res) {
  const t = await sequelize.transaction();
  try {
    const calculatedHmac = calculateHmac(req.body.obj, PAYMOB_HMAC);
    const sentHamc = req.query.hmac;

    if (calculatedHmac !== sentHamc) {
      return res.status(400);
    }

    const { id, pending, success, amount_cents, order } = req.body.obj;

    if (pending || !success || !order) {
      return res.status(400);
    }

    if (
      !order.merchant_order_id ||
      !order.amount_cents ||
      !order.id ||
      !order.shipping_data ||
      !order.items
    ) {
      return res.status(400);
    }

    if (order.id !== order.shipping_data.order_id || !order.items.length) {
      return res.status(400);
    }
    const transactionOrderId = parseInt(order.id);
    const orderId = parseInt(order.merchant_order_id);
    const orderCreatedAt = order.created_at;
    const totalAmountInCents = parseInt(amount_cents);
    const currency = order.currency;
    const transactionId = parseInt(id);

    const localOrder = await Order.findOrderById(orderId);
    if (!localOrder) {
      return res.status(400);
    }

    if (
      localOrder.currency !== currency ||
      localOrder.totalAmountInCents !== totalAmountInCents ||
      localOrder.totalQuantity !== order.items.length
    ) {
      return res.status(400);
    }

    const orderData = {
      transactionOrderId,
      transactionId,
      orderCreatedAt,
      success,
      pending,
    };

    const [numOfRowsUpdated, [updatedOrder]] = await Order.proceedOrder(
      orderId,
      orderData,
      t
    );

    if (!numOfRowsUpdated) {
      await t.rollback();
      return res.status(400);
    }
    const userId = localOrder.toJSON().userId;

    const orderBooks = await OrderBook.getAllOrderBooks(orderId, userId);

    if (!orderBooks.length) {
      await t.rollback();
      return res.status(400);
    }

    const booksPurchased = await UserBook.addOrderBooks(orderBooks, t);
    if (!booksPurchased.length) {
      await t.rollback();
      return res.status(400);
    }

    const emptyCart = await Cart.emptyCart(userId, t);

    if (!emptyCart) {
      await t.rollback();
      return res.status(400);
    }
    await t.commit();
    res.send();
  } catch (e) {
    console.log(e);
    await t.rollback();
    return res.status(400);
  }
}

async function getTransactionCallbackCtrl(req, res) {
  const body = req.query;
  if (body.success) {
    res.send("you payment went successful");
  }
  res.send(
    "something went wrong please contanct your bank or support team to readmall"
  );
}

async function allUserOrdersCtrl(req, res) {
  const userId = req.userId;
  const { limit, page } = req.query;

  try {
    const { rows: orders, count } = await Order.getAllUserOrders(
      userId,
      limit,
      page
    );
    return successHandler(
      res,
      200,
      `found ${orders.length} books user with id ${userId} purchased`,
      {
        numOfPages: orders.length ? handleNumOfPages(count, limit, 10) : 0,
        orders: orders.length ? orders : [],
      }
    );
  } catch (e) {
    return errorHandler(res, 400, e);
  }
}

module.exports = {
  checkoutCtrl,
  transactionCallbackCtrl,
  getTransactionCallbackCtrl,
  allUserOrdersCtrl,
};
