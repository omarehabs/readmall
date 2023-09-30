const crypto = require('crypto')
const { errorHandler } = require("../utils/errorHandler");
async function getToken(paymobApiKey) {
  try {
    const body = JSON.stringify({
      api_key: paymobApiKey,
    });
    const response = await fetch("https://accept.paymob.com/api/auth/tokens", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
    });
    const result = await response.json();
    return result.token;
  } catch (e) {
    return errorHandler(res, 400, e);
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

    const response = await fetch(
      "https://accept.paymob.com/api/ecommerce/orders",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
      }
    );
    const orderResult = await response.json();
    return orderResult.id;
  } catch (e) {
    return errorHandler(res, 400, e);
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

    const paymentTokenResponse = await fetch(
      "https://accept.paymob.com/api/acceptance/payment_keys",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
      }
    );

    const jsonResponse = await paymentTokenResponse.json();
    return jsonResponse.token;
  } catch (e) {
    return errorHandler(res, 400, e);
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
  const genHmac =  hmac.update(hmacString).digest("hex");
  return genHmac
}

module.exports = {
  getToken,
  getOrderId,
  getPaymenyToken,
  calculateHmac,
};
