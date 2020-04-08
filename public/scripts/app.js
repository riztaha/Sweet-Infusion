
// // // document ready
$(() => {

  // <!-- add button 'add to cart' with class name add -->
  let cart = {};
  $(".add_to_cart").click(function () {
    let name = $(this).data("name");
    let price = $(this).data("price");
    let id = $( this ).parent().attr('id')
    let quantity = cart[id] && cart[id].quantity || 1;
    cart[id] = {name, price, quantity}
    renderCart();
  });


  function subtractQty(){
    if(document.getElementById("qty").value - 1 < 0)
    return;
    else
    document.getElementById("qty").value--;
    }

    function addQty() {
      document.getElementById("qty").value++;
    }

    function renderCart() {
      $('#cart-container').empty()
    for (let i in cart) {
    let cartItem = `<section  class="flex">
                      <div class="order-buttons">
                        <input type='button' name='subtract' onclick='javascript: subtractQty();' value='-'/>
                        <input type='text' name='qty' value='${cart[i].quantity}' />
                        <input type='button' name='add' onclick='javascript: addQty();' value='+'/>
                      </div>
                      <div class="flex">
                        <h5>${cart[i].name}</h5>
                        <h5>${cart[i].price}</h5>
                      </div>
                    </section>`
      $('#cart-container').append(cartItem);
    }
    }
});



// // onclick listenner with classname add, use this.

// //need items id, name and price
// //

