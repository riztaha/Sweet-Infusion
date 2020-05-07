// const express = require("express");
const queries = require("../db/queries/queries");

// const getOrders = () => {
//   const promise = new Promise((resolve, reject) => {
//     // console.log("in getOrders function");
//     //Grabbing the function from queries.js
//     queries
//       .getOrders()
//       // db.query(queryString)
//       .then((data) => {
//         console.log("in data getOrders");
//         // console.log(data);
//         // res.json({ menu_items });
//         resolve(data);
//       })
//       .catch((err) => {
//         console.log("promise error", err.stack);
//         reject(err.stack);
//       });
//   });
//   return promise;
// };
// exports.getOrders = getOrders;

const completeCustomerOrder = function (order_id) {
  const promise = new Promise((resolve, reject) => {
    queries
      .setCustomerOrderComplete(order_id)
      .then((data) => {
        // console.log("in completeCustomerOrder. Completing customer's cart.");
        resolve(data);
      })
      .catch((err) => {
        console.log("promise error", err.stack);
        reject(err.stack);
      });
  });
  return promise;
};
exports.completeCustomerOrder = completeCustomerOrder;

const getCustomerPhone = function (order_id) {
  const promise = new Promise((resolve, reject) => {
    queries
      .getCustomerPhone(order_id)
      .then((data) => {
        // console.log(
        //   "in getCustomerPhone. Finding the customer's phone number."
        // );
        resolve(data);
      })
      .catch((err) => {
        console.log("promise error", err.stack);
        reject(err.stack);
      });
  });
  return promise;
};
exports.getCustomerPhone = getCustomerPhone;

// // Function to get a pending customer orders
const getPendingOrders = function () {
  const promise = new Promise((resolve, reject) => {
    queries
      .getPendingOrders()
      .then((data) => {
        // console.log("in getPendingOrders. Retrieving customer's cart.");
        resolve(data);
      })
      .catch((err) => {
        console.log("promise error", err.stack);
        reject(err.stack);
      });
  });
  return promise;
};
exports.getPendingOrders = getPendingOrders;

const placeOrder = function (order) {
  const promise = new Promise((resolve, reject) => {
    //Grabbing the function from queries.js
    queries
      .placeOrder(order)
      .then((data) => {
        // console.log("in placeOrder, creating empty order table");
        resolve(data);
      })
      .catch((err) => {
        console.log("Promise error", err.stack);
        reject(err.stack);
      });
  });
  return promise;
};
exports.placeOrder = placeOrder;

//This is for the joint table in the sql database - Created a order_menu_item value
const createOrder = function (order) {
  return new Promise((resolve, reject) => {
    // console.log("in createOrder function");
    queries
      .createOrder(order)
      .then((data) => {
        resolve(data);
      })
      .catch((err) => {
        console.log("promise error", err.stack);
        reject(err.stack);
      });
  });
};
exports.createOrder = createOrder;
// createOrder takes order_id, menu_item_id, and quantity
