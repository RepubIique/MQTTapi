const express = require("express");
const db = require("../db");
const router = express.Router();
const stripe = require("stripe")("sk_test_cupKvj0K2Ty0I3ZVar0Vk5PN00ioJfhbWc");

// Testing
router.get("/listusers", async (req, res) => {
  try {
    let results = await db.getAllUsers();
    res.json(results);
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
});

router.post("/createaccount/", async (req, res) => {
  try {
    let results = await db.createUser(req.body);
    if (!isEmpty(results)) res.json({ msg: "Account created", results });
    else res.json({ msg: "Unable to create account", results });
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
});

router.post("/login/", async (req, res) => {
  try {
    let results = await db.login(req.body);
    if (!isEmpty(results)) res.json({ msg: "Login successfully", results });
    else res.json({ msg: "Email or password incorrect", results });
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
});

router.get("/listproducts", async (req, res) => {
  try {
    let results = await db.getAllProducts();
    res.json(results);
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
});

router.post("/storeorder", async (req, res) => {
  try {
    let results = await db.storeOrder(req.body);
    console.log('Results',req.body)
    if (!isEmpty(results))
      res.json({ msg: "Order stored successfully", results });
    else res.json({ msg: "Unable to store order", results });
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
});


router.post("/getorders/", async (req, res) => {
  try {
    let results = await db.getOrderHistory(req.body);
    if (results) res.json({ msg: "Order history retrieved", results });
    else res.json({ msg: "Unable to get order history", results });
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
});

router.post("/pay", async (request, response) => {
  try {
    let intent;
    if (request.body.payment_method_id) {
      // Create the PaymentIntent
      intent = await stripe.paymentIntents.create({
        payment_method: request.body.payment_method_id,
        amount: 1099,
        currency: "usd",
        confirmation_method: "manual",
        confirm: true
      });
    } else if (request.body.payment_intent_id) {
      intent = await stripe.paymentIntents.confirm(
        request.body.payment_intent_id
      );
    }
    // Send the response to the client
    response.send(generateResponse(intent));
  } catch (e) {
    // Display error on client
    return response.send({ error: e.message });
  }
});

const generateResponse = intent => {
  // Note that if your API version is before 2019-02-11, 'requires_action'
  // appears as 'requires_source_action'.
  if (
    intent.status === "requires_action" &&
    intent.next_action.type === "use_stripe_sdk"
  ) {
    // Tell the client to handle the action
    return {
      requires_action: true,
      payment_intent_client_secret: intent.client_secret
    };
  } else if (intent.status === "succeeded") {
    // The payment didn’t need any additional actions and completed!
    // Handle post-payment fulfillment
    return {
      success: true
    };
  } else {
    // Invalid status
    return {
      error: "Invalid PaymentIntent status"
    };
  }
};

const isEmpty = obj => {
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) return false;
  }
  return true;
};

module.exports = router;
