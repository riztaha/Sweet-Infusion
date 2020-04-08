const generateRandomString = () => {
  let result           = '#';
  let characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  let stringLength = characters.length;
  for (let i = 0; i < 6; i++) {
    result += characters.charAt(Math.floor(Math.random() * stringLength));
  }
  return result;
};

const price = function(item) {
  let price = 0;
    for (let item in obj) {
      price += obj[item].price/100;
    }
    return price;
}

function subtractQty(){
  if(document.getElementById("qty").value - 1 < 0)
  return;
  else
  document.getElementById("qty").value--;
  }



module.exports = { subtractQty, generateRandomString, price};
