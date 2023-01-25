const Razorpay = require("razorpay");

// exports.createOrder = async (req, res) => {
//   const instance = new Razorpay({
//     key_id: process.env.Razorpay_key,
//     key_secret: process.env.Razorpay_secret,
//   });
//   await instance.orders.create({ amount: 50000 }, function (err, order) {
//     console.log(order);
//     res.status(200).json({ success: true, order, err });
//   });
// };

const express = require("express");
const app = express();
// This is your test secret API key.
const stripe = require("stripe")(
  "sk_test_51HjN8MLXtJ1ml1up0hh15liuNKcGsgcYwz78oPJOF8u0mtXO0sBRmd5lhE8inKvVWvMlnJXVj7DPKYNBhUE1Z546008wPTduhu"
);

app.use(express.static("public"));
app.use(express.json());

const calculateOrderAmount = (items) => {
  // Replace this constant with a calculation of the order's amount
  // Calculate the order total on the server to prevent
  // people from directly manipulating the amount on the client
  return 1400;
};

exports.createOrder = async (req, res) => {
  const { items } = req.body;

  // Create a PaymentIntent with the order amount and currency
  const paymentIntent = await stripe.paymentIntents.create({
    amount: calculateOrderAmount(items),
    currency: "inr",
    automatic_payment_methods: {
      enabled: true,
    },
  });

  res.send({
    clientSecret: paymentIntent,
  });
};

exports.createPaymentUser = async (req, res) => {
  const customer = await stripe.customers.create({
    email: "jeetkumar0898@gmail.com",
    name: "Jeet Chawda",
    shipping: {
      address: {
        city: "Brothers",
        country: "US",
        line1: "27 Fredrick Ave",
        postal_code: "97712",
        state: "CA",
      },
      name: "Jeet Chawda",
    },
    address: {
      city: "Brothers",
      country: "US",
      line1: "27 Fredrick Ave",
      postal_code: "97712",
      state: "CA",
    },
  });
  res.status(200).json({ customer, success: true });
};

// Set your secret key. Remember to switch to your live secret key in production.
// See your keys here: https://dashboard.stripe.com/apikeys
exports.createSubscription = async (req, res) => {
  const customerId = "cus_NEfoqak9XDPIoS";
  const priceId = "price_1MUCdLLXtJ1ml1up5qLSZh6K";

  try {
    const subscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [
        {
          price: priceId,
        },
      ],
      payment_behavior: "default_incomplete",
      payment_settings: { save_default_payment_method: "on_subscription" },
      expand: ["latest_invoice.payment_intent"],
    });

    res.send({
      subscriptionId: subscription.id,
      clientSecret: subscription.latest_invoice.payment_intent.client_secret,
    });
  } catch (error) {
    return res.status(400).send({ error: { message: error.message } });
  }
};
