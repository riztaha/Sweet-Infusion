const queries = require("../db/queries/queries");

// Function to get all customers
const getCustomers = function () {
  const promise = new Promise((resolve, reject) => {
    console.log("in getCustomers");
    //Grabbing the function from queries.js
    queries
      .getCustomers()
      // db.query(queryString)
      .then((data) => {
        // console.log(data);
        // res.json({ menu_items });
        resolve(data);
      })
      .catch((err) => {
        console.error("Promise error", err.stack);
        reject(err.stack);
      });
  });
  return promise;
};
exports.getCustomers = getCustomers;

// Function to place customer's information into db
const placeCustomerInfo = function (customer) {
  const promise = new Promise((resolve, reject) => {
    console.log("in placeCustomerInfo");
    //Grabbing the function from queries.js

    queries
      .placeCustomerInfo(customer)
      // db.query(queryString)
      .then((data) => {
        // console.log(data);
        // res.json({ menu_items });
        resolve(data);
      })
      .catch((err) => {
        console.error("Promise error", err.stack);
        reject(err.stack);
      });
  });
  return promise;
};
exports.placeCustomerInfo = placeCustomerInfo;

let customer = {
  first_name: "N/A",
  last_name: "N/A",
  email: "N/A",
  phone: "+12912959",
  street: "N/A",
  city: "N/A",
  province: "N/A",
  country: "N/A",
  postal_code: "N/A",
  credit_card: "12314512512521",
  credit_card_exp: "0120",
  credit_card_code: "123",
};

// console.log(getCustomers());
// placeCustomerInfo(customer); //THIS IS NOW WORKING!!!!!
