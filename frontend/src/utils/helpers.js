import CryptoJS from 'crypto-js';

/**
 * Encrypt input data
 * @param {string} data 
 */
export const encryptData = function (data) {
  const encryptionKey = import.meta.env.VITE_REACT_APP_ENCRYPTION_KEY;
  const encryptionIV = import.meta.env.VITE_REACT_APP_ENCRYPTION_IV;
  const wordArray = CryptoJS.enc.Utf16.parse(data);

  return CryptoJS.AES.encrypt(wordArray, encryptionKey, { iv: encryptionIV }).toString(CryptoJS.format.Hex);
}

/**
 * Decrypt received encrypted string
 * @param {string} data 
 */
export const decryptData = function (data) {
  if(!data) return data;

  const encryptionKey = import.meta.env.VITE_REACT_APP_ENCRYPTION_KEY;
  const encryptionIV = import.meta.env.VITE_REACT_APP_ENCRYPTION_IV;

  return CryptoJS.AES.decrypt(CryptoJS.format.Hex.parse(data), encryptionKey, { iv: encryptionIV }).toString(CryptoJS.enc.Utf16);
}