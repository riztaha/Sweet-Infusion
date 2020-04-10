// load .env data into process.env
require("dotenv").config();

// Web server config
const PORT = process.env.PORT || 8080;
const ENV = process.env.ENV || "development";
const express = require("express");
const bodyParser = require("body-parser");
const sass = require("node-sass-middleware");
const app = express();
const morgan = require("morgan");
// const cookieSession = require("cookie-session");

const { generateRandomString } = require("./helpers");
// PG database client/connection setup
const { Pool } = require("pg");
const dbParams = require("./lib/db.js");
const db = new Pool(dbParams);
db.connect();

// Load SMS API - Twilio
const MessagingResponse = require("twilio").twiml.MessagingResponse;

// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output colored by response status for development use.
//         The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
app.use(morgan("dev"));

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  "/styles",
  sass({
    src: __dirname + "/styles",
    dest: __dirname + "/public/styles",
    debug: true,
    outputStyle: "expanded",
  })
);
app.use(express.static("public"));

// Separated Routes for each Resource
// Note: Feel free to replace the example routes below with your own
// const usersRoutes = require("./routes/users");
// const widgetsRoutes = require("./routes/widgets");
const menuRoutes = require("./routes/menu");
const orderRoutes = require("./routes/orders");
const customerRoutes = require("./routes/customers");

// Mount all resource routes
// Note: Feel free to replace the example routes below with your own
// app.use("/api/users", usersRoutes(db));
// app.use("/api/widgets", widgetsRoutes(db));

// Note: mount other resources here, using the same pattern above

// Home page
// Warning: avoid creating more routes in this file!
// Separate them into separate routes files (see above).
app.get("/", (req, res) => {
  menuRoutes
    .getAllMenuItems(db)
    .then((obj) => {
      res.render("index", { menu_items: obj });
    })
    .catch((err) => {
      res.render("error", err);
    });
});

// Menu Page
app.get("/menu", (req, res) => {
  menuRoutes
    .getAllMenuItems()
    .then((obj) => {
      res.render("menu", { menu_items: obj });
    })
    .catch((err) => {
      res.render("error", err);
    });
  console.log("GET menu");
});

//template file do ajax request make a request to /api/menu... this is done in app.js

app.post("/menu", (req, res) => {
  console.log("Menu Req Body ------>", req.body);
  console.log("POST menu");
});

// app.get("/cart", (req, res, err) => {
//   if (err) {
//     res.render("error");
//   } else {
//     res.render("cart", { order_id: JSON.stringify(order) });
//   }
// });

app.post("/checkout", function (req, res) {
  let cart = JSON.parse(req.body.cart);
  console.log("Cart ------->", cart);

  res.render("cart", {
    cart: JSON.stringify(cart),
  });
});
// createOrder takes order_id, menu_item_id, and quantity

app.get("/restaurant", function (req, res) {
  res.render("restaurant");
});

app.post("/restaurant", function (req, res) {
  // sendOrderCompleteText('+14165353345')
  res.render("restaurant");
});

const getMaxPrepTime = function (cart) {
  const max = cart.reduce(function (prev, current) {
    return prev.prep_time > current.prep_time ? prev : current;
  }); //returns object
  return max.prep_time;
};

app.get("/complete", function (req, res) {
  res.render("complete");
});

app.get("/error", function (req, res) {
  res.render("error");
});

app.post("/placeOrder", function (req, res) {
  //Placing the customer's info into the database:
  console.log("Req.Body ------->", req.body);
  let customer = {
    name: req.body.name,
    phone: req.body.phone,
    address: req.body.address,
    zip_code: req.body.zip_code,
    credit_card: req.body.cc_number,
    credit_card_exp: req.body.cc_exp,
    credit_card_code: req.body.cc_code,
  };
  let cart = JSON.parse(req.body.cart);

  customerRoutes
    .placeCustomerInfo(customer)
    .then((customerInfo) => {
      let order = {
        customer_id: customerInfo[0].id,
        is_order_complete: "false",
      };
      orderRoutes.placeOrder(order).then((results) => {
        let invoiceNumber = results[0].id;
        console.log("Invoice Number ------------>", invoiceNumber);
        //Iterating through the array of cart, and adding each item to the order_menu_item db
        let promises = [];
        cart.forEach((item) => {
          let order = {
            order_id: invoiceNumber,
            menu_item_id: item.id,
            item_quantity: item.quantity,
          };
          promises.push(orderRoutes.createOrder(order));

          Promise.all(promises)
            .then((resolvedPromise) => {
              if (promises.length === resolvedPromise.length) {
                console.log("all promises fulfilled, orders are now in db");
                // Render cart page and pass the cart and order number with it.
                let maxPrepTime = getMaxPrepTime(cart);
                console.log("maxPrepTime" + maxPrepTime);

                let phone = "";
                phone = `+1${req.body.phone.split("-").join("")}`;
                console.log("phone" + phone);

                // sendCustomerOrderText(phone, maxPrepTime)

                res.render("complete", {
                  order_id: invoiceNumber,
                  cart: JSON.stringify(cart),
                  customer: JSON.stringify(customer),
                  maxPrepTime: maxPrepTime,
                });
              }
              // } else {
              //   // if within 10 seconds not all the orders have been placed, show error
              //   setTimeout(() => {
              //     res.render("error");
              //   }, 10000);
              // }
            })
            .catch((e) => {
              // handle errors here
            });
        });
      });
    })
    .catch((err) => {
      res.render("error", err);
    });
});

//These are account login details for twilio to be able to send texts.
const accountSid = "";
const authToken = "";
// const client = require('twilio')(accountSid, authToken);
// This function sends via text the estimated time the order will be completed to the customer
const sendCustomerOrderText = function (phone, time) {
  client.messages
    .create({
      body: `Thank you for your order of ${itemNameString}. It will be ready for pick up in ${time} minutes.`,
      from: "+15406573369",
      to: phone,
    })
    .then((message) => console.log(message.sid));
};

// This function sends a text to the customer to let them know thier order is ready.
const sendOrderCompleteText = function (phone) {
  client.messages
    .create({
      body: `Your order is complete and is ready to be picked up. Enjoy!`,
      from: "+15406573369",
      to: phone,
    })
    .then((message) => console.log(message.sid));
};

// This function sends via text the order to the restaurant
const sendRestaurantSMSText = function (itemNameString) {
  client.messages
    .create({
      body: `An order has been placed: ${itemNameString}`,
      from: "+15406573369",
      to: "+14165353345",
    })
    .then((message) => console.log(message.sid));
};

//Server is listening to you and watching your every move. Evil.
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
