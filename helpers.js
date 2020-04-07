generateRandomString = () => {
  let result           = '#';
  let characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  let stringLength = characters.length;
  for (let i = 0; i < 6; i++) {
    result += characters.charAt(Math.floor(Math.random() * stringLength));
  }
  return result;
};

module.exports = { generateRandomString };
