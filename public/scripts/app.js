// // // document ready
$(() => {
  // <!-- add button 'add to cart' with class name add -->
  let cart = {};
  let total = 0;

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

    console.log(id);
    console.log(cart[id]);

    removeFromCart(id);
  });

  $("#order_form").on("click", ".addItem", function (event) {
    console.log(event.data);
    let id = $(this).data("id");
    console.log(id);
    console.log(cart[id]);
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
        `<section class="flex">
                      <div class="order-buttons">
                        <input value='-' type='button' class='subtractItem' data-id=` +
        i +
        `>
                        <input type='text' disabled name='qty' value=${cart[i].quantity} />
                        <input value='+' type='button' class='addItem' data-id=` +
        i +
        `></div>
                      <div class="flex">
                        <h5>${cart[i].name}</h5>
                        <h5>${cart[i].price}</h5>
                      </div>
                      <div>
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


});

function subtractQty() {
  if (document.getElementsByName("qty").value - 1 < 0) return;
  else document.getElementsByName("qty").value--;
}

function addQty() {
  document.getElementsByName("qty").value++;
}
