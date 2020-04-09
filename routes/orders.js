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
    queries
      .getCustomerOrder(customer_id)
      .then((data) => {
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
    //Grabbing the function from queries.js
    queries.placeOrder(order).catch((err) => {
      console.error("Promise error", err.stack);
      reject(err.stack);
    });
  });
  return promise;
};
exports.placeOrder = placeOrder;

//This is for the joint table in the sql database - Created a order_menu_item value
const createOrder = function (order) {
  const promise = new Promise((resolve, reject) => {
    // console.log("in createOrder function");
    queries
      .createOrder(order)
      .then((data) => {
        console.log("Creating Order");
        resolve(data);
      })
      .catch((err) => {
        console.error("query error", err.stack);
        reject(err.stack);
      });
  });
  return promise;
  // const queryString = `
  // INSERT INTO order_menu_items (order_id, menu_item_id, item_quantity)
  // VALUES ($1, $2, $3)
  // `;
  // const queryParams = [
  //   order["order_id"],
  //   order["menu_item_id"],
  //   order["item_quantity"],
  // ];
  // return pool
  //   .query(queryString, queryParams)
  //   .then((res) => {
  //     return res.rows;
  //   })
  //   .catch((err) => console.err("Query Error", err.stack));
};
exports.createOrder = createOrder;
