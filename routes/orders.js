// const express = require("express");
const queries = require("../db/queries/queries");

const getOrders = () => {
  const promise = new Promise((resolve, reject) => {
    // console.log("in getOrders function");
    //Grabbing the function from queries.js
    queries
      .getOrders()
      // db.query(queryString)
      .then((data) => {
        console.log("in data getOrders");
        // console.log(data);
        // res.json({ menu_items });
        resolve(data);
      })
      .catch((err) => {
        console.error("query error", err.stack);
        reject(err.stack);
      });
  });
  return promise;
};
exports.getOrders = getOrders;

// Function to get a specific customer's order
const getCustomerOrder = function (customer_id) {
  const promise = new Promise((resolve, reject) => {
    // console.log("in getAllMenuItems");
    //Grabbing the function from queries.js
    queries
      .getCustomerOrder(customer_id)
      // db.query(queryString)
      .then((data) => {
        // console.log("in getAllMenuItems");
        // console.log(data);
        // res.json({ menu_items });
        resolve(data);
      })
      .catch((err) => {
        console.error("query error", err.stack);
        reject(err.stack);
      });
  });
  return promise;
};
exports.getCustomerOrder = getCustomerOrder;

const placeOrder = function (order) {
  const promise = new Promise((resolve, reject) => {
    console.log("in placeOrder function");
    //Grabbing the function from queries.js
    queries.placeOrder(order).catch((err) => {
      console.error("Promise error", err.stack);
      reject(err.stack);
    });
  });
  return promise;
};
exports.placeOrder = placeOrder;

// let order = {
//   customer_id: "6",
//   is_order_complete: "no",
// };

// placeOrder(order);
// Function is working but it needs an object with the customer_id.
