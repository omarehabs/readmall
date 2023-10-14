const crypto = require("crypto");
const { errorHandler } = require("../utils/errorHandler");
const axios = require("axios");
async function getToken(paymobApiKey) {
  try {
    const body = JSON.stringify({
      api_key: paymobApiKey,
    });
    const response = await axios.post(
      "https://accept.paymob.com/api/auth/tokens",
      body,
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    return response.data.token;
  } catch (e) {
    console.log(e, ' from getToken')
    return e;
  }
}

async function getOrderId(items, localOrderId, totalAmount, currency, token) {
  try {
    const body = JSON.stringify({
      auth_token: token,
      delivery_needed: "false",
      amount_cents: totalAmount,
      currency: currency,
      merchant_order_id: localOrderId,
      items,
    });

    const response = await axios.post(
      "https://accept.paymob.com/api/ecommerce/orders",
      body,
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    return response.data.id;
  } catch (e) {
    console.log(e, ' from getOrderId')
    return e;
  }
}

async function getPaymenyToken(
  totalAmount,
  token,
  expiresInSeconds,
  orderId,
  currency,
  billingData,
  integrationId
) {
  try {
    const body = JSON.stringify({
      auth_token: token,
      amount_cents: totalAmount,
      expiration: expiresInSeconds,
      order_id: orderId,
      billing_data: billingData,
      currency,
      integration_id: integrationId,
      lock_order_when_paid: "false",
    });

    const paymentTokenResponse = await axios.post(
      "https://accept.paymob.com/api/acceptance/payment_keys",
      body,
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    return paymentTokenResponse.data.token;
  } catch (e) {
    console.log(e, ' from getPaymenyToken')
    return e;
  }
}

function calculateHmac(
  {
    amount_cents,
    created_at,
    currency,
    error_occured,
    has_parent_transaction,
    id,
    integration_id,
    is_3d_secure,
    is_auth,
    is_capture,
    is_refunded,
    is_standalone_payment,
    is_voided,
    order,
    owner,
    pending,
    source_data,
    success,
  },
  paymobHmac
) {
  const hmacString = `${amount_cents}${created_at}${currency}${error_occured}${has_parent_transaction}${id}${integration_id}${is_3d_secure}${is_auth}${is_capture}${is_refunded}${is_standalone_payment}${is_voided}${order.id}${owner}${pending}${source_data.pan}${source_data.sub_type}${source_data.type}${success}`;
  const hmac = crypto.createHmac("SHA512", paymobHmac);
  const genHmac = hmac.update(hmacString).digest("hex");
  return genHmac;
}

module.exports = {
  getToken,
  getOrderId,
  getPaymenyToken,
  calculateHmac,
};
