// sharedData.js
let storedAmount = 0; // Initialize with a default value

exports.getAmount = () => storedAmount;

exports.setAmount = (newAmount) => {
  storedAmount = newAmount/100;
};
