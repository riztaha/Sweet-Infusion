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
const usersRoutes = require("./routes/users");
const widgetsRoutes = require("./routes/widgets");
const menuRoutes = require("./routes/menu");
const orderRoutes = require("./routes/orders");

// Mount all resource routes
// Note: Feel free to replace the example routes below with your own
app.use("/api/users", usersRoutes(db));
app.use("/api/widgets", widgetsRoutes(db));


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
});

//template file do ajax request make a request to /api/menu... this is done in app.js

app.post("/menu", (req, res) => {
  console.log("Menu Req Body ------>", req.body);
});

app.get("/cart", (req, res) => {
  res.render("cart");
});

let maxPrepTime = 0;
app.post("/cart", function (req, res) {
  console.log("CART ITEMS -------->", req.body);
  // This code takes prep times from order and returns the longest time to be used to send
  // text to customer with that information.
  let prepTimeArray = req.body.item_prep_time
  prepTimeArray = prepTimeArray.map(x => Number.parseInt(x))
  maxPrepTime = prepTimeArray.reduce(function(a,b) {
    return Math.max(a, b)
  });


  // Create customer table, with empty stuff
  // console.log(order)
  // orderRoutes.placeOrder(order)
  // Create new order with the menu items at the same time
  // Add the data into the customer table
  // Create a order_menu_item with the menu_items and orders
  res.render("cart");
});

app.get("/restaurant", function (req, res) {
  res.render("restaurant");
});

app.get("/complete", function (req, res) {
  // Show customer's info
  // Show order info
  orderRoutes
    .getOrders(db, req["customer_id"])
    .then((obj) => {
      res.render("complete", { orders: obj });
    })
    .catch((err) => {
      res.render("error", err);
    });
});

app.post("/complete", function (req, res) {
  let time = maxPrepTime;
  let phone = `+1${req.body.x_prom.split('-').join('')}`;
  // sendCustomerSMSText(phone, time) // this calls function to send text with phone, time
  // as argument to customer
  let order = ''
  // sendRestaurantSMSText(order) // this calls function to send text to with order as argument
  // to restaurant.
  console.log("CREDIT CARD CUSTOMER INFO --------> ", req.body);

  orderRoutes
    .getOrders(db)
    .then((obj) => {
      res.render("complete", { orders: obj });
    })
    .catch((err) => {
      res.render("error", err);
    });
});

// This posts to /sms, but I don't think we actually need the /sms page or this code.
// To be determined.
// This is used for the SMS API (Twilio). When it recieves a text from a customer,
// it immediatly responds back with a message. -> twiml.message();
// app.post("/sms", (req, res) => {
//   const twiml = new MessagingResponse();
//   twiml.message("Your order is ready for pick-up!!!");
//   res.writeHead(200, { "Content-Type": "text/xml" });
//   res.end(twiml.toString());
// });

// This is a function that sends a text message when called with the
// time as an argument for the message body
// const accountSid = '';
// const authToken = '';
// const client = require('twilio')(accountSid, authToken);
// const sendCustomerSMSText = function(phone, time) {
//   client.messages
//     .create({
//       body: `Thank you for your order. It will be ready for pick up in ${time} minutes.`,
//       from: '+15406573369',
//       to: phone
//     }).then(message => console.log(message.sid));
// };

// const sendRestaurantSMSText = function(order) {
//   client.messages
//     .create({
//       body: `An order has been placed: ${order}`,
//       from: '+15406573369',
//       to: '+14165353345'
//     }).then(message => console.log(message.sid));
// };




//Server is listening.
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
