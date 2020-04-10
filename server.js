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
const customerRoutes = require("./routes/customers");

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
    console.log("GET menu")
});

app.post("/menu", (req, res) => {
  console.log("Menu Req Body ------>", req.body);
  console.log("POST menu")
});

// We do not want people to access the cart directly. Only through the menu page.
app.get("/cart", (req, res, err) => {
  // if (err) {
  res.render("error");
  // } else {
  // res.render("cart", { order_id: JSON.stringify(order) });
  // }
});

// After the user chooses their items, it gets posted to the checkout page where they can pay
app.post("/checkout", function (req, res) {
  let cart = JSON.parse(req.body.cart);
  console.log("Cart ------->", cart);

  res.render("cart", {
    cart: JSON.stringify(cart),
    cartObj: cart, //sending to ejs as an object so we can display it there
  });
});

//Placing the order after the customer checks out.
app.post("/placeOrder", function (req, res) {
  //Placing the customer's info into the database:
  console.log("Posting to /placeOrder");
  console.log("Req.Body ------->", req.body);
  console.log("Cart ------->", req.body.cart);
  let customer = {
    name: req.body.name,
    phone: req.body.phone,
    address: req.body.address,
    zip_code: req.body.zip_code,
    credit_card: req.body.cc_number,
    credit_card_exp: req.body.cc_exp,
    credit_card_code: req.body.cc_code,
    order: JSON.parse(req.body.order),
  };
  customerRoutes
    .placeCustomerInfo(customer)
    .then(() => {
      res.render("complete", { customer });
      // console.log("-----This is customer", customer)
      console.log("-----This is customer.order.cart.cart", customer.order.cart.cart)

    })
    .catch((err) => {
      res.render("error", err);
    });

  // console.log("THIS IS LINE 165 customer.order.cart.cart---->", typeof customer.order.cart.cart, customer.order.cart.cart);
  let order = JSON.parse(customer.order.cart.cart)
  // console.log("THIS IS LINE 167 order - post JSON---->", typeof order, order);
  let timesArray = []
  for (const item in order) {
    timesArray.push(order[item].prep_time)
  }
  timesArray = timesArray.map((x) => Number.parseInt(x));
  maxPrepTime = timesArray.reduce(function (a, b) {
    return Math.max(a, b);
  });

  let phone = "";
  let time = maxPrepTime
  phone = `+1${req.body.phone.split('-').join('')}`;
  // sendCustomerOrderText(phone, time)

  let itemNameArray = []
  for (const item in order) {
    itemNameArray.push(order[item].name)
  }
  itemNameString = itemNameArray.join(", ")
  // sendRestaurantSMSText(itemNameArray)
  // console.log("--------FROM APP.POST ----- /complete-------")
  // console.log("This is customer.name:", customer.name)
  // console.log("This is order items:", itemNameArray)
  // console.log("This is order completion time:", maxPrepTime)
});

//For the restaurant page
app.post("/completeOrder", function (req, res) {
  console.log("COMPLETE ORDER REQ BODY =======>", req.body);
  let order_id = req.body.order_id;
  //This complete's the customer's order and removes it from the page. Sets it in the DB as complete.
  orderRoutes.completeCustomerOrder(order_id).then((result) => {
    res.sendStatus(200);
    orderRoutes.getCustomerPhone(order_id).then((number) => {
      console.log("CUSTOMER'S PHONE NUMBER =====>", number[0].phone);
      let phone = number[0].phone;
      // sendOrderCompleteText(phone);
      console.log("SENDING A TEXT TO THE CUSTOMER TO PICK UP THEIR ORDER");
      //Send the text to customer that their order is complete
    });
  });
});

app.get("/pendingOrders", function (req, res) {
  orderRoutes.getPendingOrders().then((result) => {
    console.log(result);
    res.send(JSON.stringify(result));
  });
});

app.get("/restaurant", function (req, res) {
  res.render("restaurant");
});

// Only want customers accessing /complete through the menu order form route.
app.get("/complete", function (req, res) {
  res.render("error");
});

//Error-handling
app.get("/error", function (req, res) {
  res.render("error");
});

//Helper function to get the longest prep time item in a customer's cart.
const getMaxPrepTime = function (cart) {
  const max = cart.reduce(function (prev, current) {
    return prev.prep_time > current.prep_time ? prev : current;
  }); //returns object
  return max.prep_time;
};

// SMS Twilio API below
//These are account login details for twilio to be able to send texts.
const accountSid = '';
const authToken = '';
// const client = require('twilio')(accountSid, authToken);
// This function sends via text the estimated time the order will be completed to the customer
const sendCustomerOrderText = function(phone, time) {
  client.messages
    .create({
      body: `Thank you for your order of ${itemNameString}. It will be ready for pick up in ${time} minutes.`,
      from: '+15406573369',
      to: phone
    }).then(message => console.log(message.sid));
};

// This function sends a text to the customer to let them know thier order is ready.
const sendOrderCompleteText = function(phone) {
  client.messages
    .create({
      body: `Your order is  complete and is ready to be picked up. Enjoy!`,
      from: '+15406573369',
      to: phone
    }).then(message => console.log(message.sid));
};

// This function sends via text the order to the restaurant
const sendRestaurantSMSText = function(itemNameString) {
  client.messages
    .create({
      body: `An order has been placed: ${itemNameString}`,
<<<<<<< HEAD
      from: "+15406573369",
      to: "+16479961093", //The restaraunt's phone number
    })
    .then((message) => console.log(message.sid));
=======
      from: '+15406573369',
      to: '+14165353345'
    }).then(message => console.log(message.sid));
>>>>>>> c5a1592f59bd6b2bcfe51f4b3e7cda0a5bd0ee5c
};

//Server is listening to you and watching your every move. Evil.
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
