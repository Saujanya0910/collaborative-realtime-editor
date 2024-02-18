const CryptoJS = require('crypto-js');

/**
 * Encrypt input data
 * @param {string} data 
 */
module.exports.encryptData = function (data) {
  const encryptionKey = process.env.ENCRYPTION_KEY;
  const encryptionIV = process.env.ENCRYPTION_IV;
  const wordArray = CryptoJS.enc.Utf16.parse(data);

  return CryptoJS.AES.encrypt(wordArray, encryptionKey, { iv: encryptionIV }).toString(CryptoJS.format.Hex);
}

/**
 * Decrypt received encrypted string
 * @param {string} data 
 */
module.exports.decryptData = function (data) {
  if(!data) return data;

  const encryptionKey = process.env.ENCRYPTION_KEY;
  const encryptionIV = process.env.ENCRYPTION_IV;

  return CryptoJS.AES.decrypt(CryptoJS.format.Hex.parse(data), encryptionKey, { iv: encryptionIV }).toString(CryptoJS.enc.Utf16);
}