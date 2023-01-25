const {
  createOrder,
  createPaymentUser,
  createSubscription,
} = require("../Controllers/Payment_Controller");

const router = require("express").Router();

router.post("/createOrder", createOrder);
router.post("/createPaymentCustomer", createPaymentUser);
router.post("/createSubscription", createSubscription);

module.exports = router;
