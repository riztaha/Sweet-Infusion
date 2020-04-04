const express = require("express");
const router = express.Router();

module.exports = (db) => {
  router.get("/", (req, res) => {
    const queryString = `
    SELECT *
    FROM menu_items;
    `;
    db.query(queryString)
      .then((data) => {
        const menu_items = data.rows;
        res.json({ menu_items });
      })
      // (res) => res.rows)
      .catch((err) => console.error("query error", err.stack));
  });
  return router;
};

// $(() => {
//   $.ajax({
//     method: "GET",
//     url: "/api/menu",
//   }).done((menu) => {
//     for (item of menu) {
//       $("<div>").text(item).appendTo($("body"));
//     }
//   });
// });
