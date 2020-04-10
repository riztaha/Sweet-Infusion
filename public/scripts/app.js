// // // document ready
$(() => {
  // <!-- add button 'add to cart' with class name add -->
  let cart = [];

  $(".add_to_cart").click(function () {
    let name = $(this).data("name");
    let price = $(this).data("price");
    let prep_time = $(this).data("prep_time");
    let id = $(this).parent().attr("id");
    addToCart(name, price, prep_time, id);
  });

  function addToCart(name, price, prep_time, id) {
    let itemIndex = getCartItemById(id);
    let quantity =
      cart[itemIndex] && cart[itemIndex].quantity
        ? cart[itemIndex].quantity + 1
        : 1;
    let tmp = { id, name, price, prep_time, quantity };
    if (itemIndex < 0) {
      cart.push(tmp);
    } else {
      cart[itemIndex] = tmp;
    }
    renderCart();
    console.log(cart);
  }

  function removeFromCart(id) {
    let itemIndex = getCartItemById(id);
    if (itemIndex >= 0) {
      let quantity = cart[itemIndex] ? cart[itemIndex].quantity - 1 : 0;
      if (quantity === 0) {
        //TODO, remove id from cart entirely
        cart.splice(itemIndex, 1);
      } else {
        cart[itemIndex].quantity = quantity;
      }
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
    let itemIndex = getCartItemById(id);
    addToCart(
      cart[itemIndex].name,
      cart[itemIndex].price,
      cart[itemIndex].prep_time,
      id
    );
  });

  function getCartItemById(id) {
    return cart.findIndex((x) => parseInt(x.id) === parseInt(id));
  }

  function renderCart() {
    $("#cart-container").text("Add Items From Menu");

    let subtotal = 0;
    let total = 0;
    if (cart.length > 0) {
      $("#cart-container").empty();
      for (let item of cart) {
        console.log(item);
        subtotal += parseFloat(item.price) * parseFloat(item.quantity);
        total = subtotal * 1.13;
        let cartHtml =
          `<section class="cart flex">
                        <div order-buttons">
                          <input value='-' type='button' class='btn subtractItem' data-id=` +
          item.id +
          `>
                          <input type='text' disabled name='qty' value=${item.quantity} />
                          <input value='+' type='button' class='btn addItem' data-id=` +
          item.id +
          `>
                        </div>
                        <div class="flex">
                          <h5 class= "cart-item cart-item-name">${item.name}</h5>
                          <h5 class="cart-item cart-item-price">${item.price}</h5>
                        </div>
        </section>`;

        $("#cart-container").append(cartHtml);
        //TODO: Fix this object, it should not be
        //'{"1":{"name":"Cherry Pie","price":"5.00","prep_time":2,"quantity":1}}' } }
        //should be:
        //[{"id": 1, "name":"Cherry Pie","price":"5.00","prep_time":2,"quantity":1}}, {}, ...]
        $("#cart").val(JSON.stringify(cart));
      }
    }
    $("#subtotal").html(subtotal.toFixed(2));
    $("#total").html(total.toFixed(2));
  }
});
