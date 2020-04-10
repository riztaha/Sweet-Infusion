// // // document ready
$(() => {
  // <!-- add button 'add to cart' with
  // ass name add -->
  let cart = [];
  let orders = [];

  $(".add_to_cart").click(function () {
    let name = $(this).data("name");
    let price = $(this).data("price");
    let prep_time = $(this).data("prep_time");
    let id = $(this).parent().attr("id");

    addToCart(name, price, prep_time, id);
  });


  function addToCart(name, price, prep_time, id) {
    let quantity = cart[id] ? cart[id].quantity + 1 : 1;
    cart[id] = { name, price, prep_time, quantity };
    renderCart();
    console.log(cart);
  }

  function removeFromCart(id) {
    let quantity = cart[id] ? cart[id].quantity - 1 : 0;
    if (quantity === 0) {
      //TODO, remove id from cart entirely
      delete cart[id];
    } else {
      cart[id].quantity = quantity;
    }
    renderCart();
  }


  $("#order_form").on("click", ".subtractItem", function () {
    let id = $(this).data("id");

    removeFromCart(id);
  });

  $("#order_form").on("click", ".addItem", function (event) {
    console.log(event.data);
    let id = $(this).data("id");
    addToCart(cart[id].name, cart[id].price, cart[id].prep_time, id);
  });

  function renderCart() {
    $("#cart-container").empty();
    let subtotal = 0;
    let total = 0;
    for (let i in cart) {
      subtotal =
        (subtotal + parseFloat(cart[i].price)) * parseFloat(cart[i].quantity);
      total = subtotal * 1.13;
      let cartHtml =
        `<section class="cart flex">
                      <div order-buttons">
                        <input value='-' type='button' class='btn subtractItem' data-id=` + i + `>
                        <input type='text' disabled name='qty' value=${cart[i].quantity} />
                        <input value='+' type='button' class='btn addItem' data-id=` + i +`>
                      </div>
                      <div class="flex">
                        <h5 class= "cart-item cart-item-name">${cart[i].name}</h5>
                        <h5 class="cart-item cart-item-price">${cart[i].price}</h5>
                      </div>
      </section>`;

      $("#cart-container").append(cartHtml);
      //TODO: Fix this object, it should not be
      //'{"1":{"name":"Cherry Pie","price":"5.00","prep_time":2,"quantity":1}}' } }
      //should be:
      //[{"name":"Cherry Pie","price":"5.00","prep_time":2,"quantity":1}}, {}, ...]
      $("#cart").val(JSON.stringify(cart));
    }

    $("#subtotal").html(subtotal.toFixed(2));
    $("#total").html(total.toFixed(2));
  }

<<<<<<< HEAD
  // JQUERY for restaurant-side

  function groupItemsByOrderId() {
    result = orders.reduce(function (r, a) {
      r[a.order_id] = r[a.order_id] || [];
      r[a.order_id].push(a);
      return r;
    }, Object.create(null));
    // console.log(result);
    return result;
  }

  function renderPendingOrders() {
    $("#pending-orders").empty();
    //If the object (viewed as an array) has keys in it, then
    if (Object.keys(orders).length > 0) {
      //Looping through the orders object
      // let name = "";
      // let phone = "";
      // const unique = orders555.map((item) => {
      //   // console.log("item 1 =====>", item[1]);
      //   item[1].forEach((value) => {
      //     name = value.customer_name;
      //     phone = value.customer_phone;
      //   });
      // });

      let pendingHtml = "";

      // const orders555 = Object.entries(orders);
      // orders555.map((item) => {
      //   console.log("item  =====>", item[1]);
      //   item[1].forEach((value) =>
      //     // console.log("value", value.customer_name, value.customer_phone);
      //     pendingHtml = `<h3> Customer Name: ${value.customer_name}, Customer Phone: ${value.customer_phone}`;
      //   );
      // });

      for (let orderId in orders) {
        pendingHtml += `<h3>Invoice ${orderId} for Customer Name:  Customer Number:  </h3>`;
        //Looping through the orderID array
        for (let item of orders[orderId]) {
          pendingHtml += `<pre> ${item.item} - quantity ${item.quantity} </pre>`;
        }
        pendingHtml +=
          `<input value='Complete Order' type='button' class='btn completeOrder' data-id=` +
          orderId +
          `><br>`;
      }
      $("#pending-orders").append(pendingHtml);
    }
  }

  function markAsComplete(order_id) {
    $.post("/completeOrder", { order_id }).done(function (data) {
      console.log(data);
      delete orders[order_id];
      renderPendingOrders();
    });
  }

  $("#pending-orders").on("click", ".completeOrder", function (event) {
    console.log(event.data);
    // event.preventDefault();
    // console.log($(event.target))
    let order_id = $(this).data("id");
    markAsComplete(order_id);
  });

  function doPollForPendingOrders() {
    $.get("/pendingOrders", function (data) {
      orders = JSON.parse(data);
      console.log("pending orders:");
      // console.log("orders", orders); // process results here
      orders = groupItemsByOrderId();
      // console.log("Grouped items by order ID", orders); // process results here
      renderPendingOrders();
      setTimeout(doPollForPendingOrders, 30000); //Page will keep refreshing every 30s to see if any new orders have been added
    });
  }
  doPollForPendingOrders();
=======

>>>>>>> c5a1592f59bd6b2bcfe51f4b3e7cda0a5bd0ee5c
});

