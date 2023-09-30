const crypto = require("crypto");

const jj = {
  id: "135040701",
  pending: "false",
  amount_cents: "2750",
  success: "true",
  is_auth: "false",
  is_capture: "false",
  is_standalone_payment: "true",
  is_voided: "false",
  is_refunded: "false",
  is_3d_secure: "true",
  integration_id: "3916064",
  profile_id: "823295",
  has_parent_transaction: "false",
  order: "153829486",
  created_at: "2023-09-30T08:55:14.070087",
  currency: "EGP",
  merchant_commission: "0",
  discount_details: "[]",
  is_void: "false",
  is_refund: "false",
  error_occured: "false",
  refunded_amount_cents: "0",
  captured_amount: "0",
  updated_at: "2023-09-30T08:55:39.462405",
  is_settled: "false",
  bill_balanced: "false",
  is_bill: "false",
  owner: "1433803",
  merchant_order_id: "27",
  "data.message": "Approved",
  "source_data.type": "card",
  "source_data.pan": "2346",
  "source_data.sub_type": "MasterCard",
  acq_response_code: "00",
  txn_response_code: "APPROVED",
  hmac: "6d195265bc1bedc075bc8811cf87476809015a3d95cb0432eec722763bb12670117b626edb2171da143dde31dd4da785a0a45a0fa0ddf938b0bad5f3d6311e79",
};

const hmacString = `${jj.amount_cents}${jj.created_at}${jj.currency}${jj.error_occured}${jj.has_parent_transaction}${jj.id}${jj.integration_id}${jj.is_3d_secure}${jj.is_auth}${jj.is_capture}${jj.is_refunded}${jj.is_standalone_payment}${jj.is_voided}${jj.order}${jj.owner}${jj.pending}${jj["source_data.pan"]}${jj["source_data.sub_type"]}${jj["source_data.type"]}${jj.success}`;
// const hmac = crypto.createHmac("sha256", process.env.PAYMOB_HMAC);
// data = hmac.update(hmacString);
// generatedHamc = data.digest('hex');
console.log(hmacString);
// console.log(jj.hmac)
const hmac = crypto.createHmac("SHA512", "F41BF60E7959A5DEEAE4DC0AA658FE33");
data = hmac.update(hmacString).digest("hex");
// generatedHamc = data.digest("base64");
console.log(data);

console.log(jj.hmac);
