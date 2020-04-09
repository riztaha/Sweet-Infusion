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
    let quantity = (cart[id] && cart[id].quantity) || 1;
    cart[id] = { name, price, prep_time, quantity };
    console.log(cart);
    renderCart();
  });




  function renderCart() {
    $("#cart-container").empty();
    for (let i in cart) {
      let cartItem = `<section  class="flex">
                      <div class="order-buttons">
                        <input type='button' name='subtract' onclick='javascript: subtractQty();' value='-'/>
                        <input type='text' name='qty' value=${cart[i].quantity} />
                        <input type='button' name='add' onclick='javascript: addQty();' value='+'/>
                      </div>
                      <div class="flex">
                        <h5>${cart[i].name}</h5>
                        <h5>${cart[i].price}</h5>
                      </div>
                      <div>
                      <input style="display: none;" type="text" name="item_name" value=${cart[i].name}>
                      <input style="display: none;" type="text" name="item_price" value=${cart[i].price}>
                      <input style="display: none;" type="text" name="item_prep_time" value=${cart[i].prep_time}>
                      </div>
                    </section>`;
      $("#cart-container").append(cartItem);
    }
  }


});

function subtractQty() {
  if (document.getElementsByName("qty").value - 1 < 0) return;
  else document.getElementsByName("qty").value--;
}

function addQty() {
  document.getElementsByName("qty").value++;
}
