import axios from 'axios';
import { decryptData, encryptData } from './utils/helpers';

/**
 * Submit code to backend for compilation & execution
 * @param {{ language_id: number, source_code: string, stdin?: string, token?: string }} payload 
 */
export const submitCodeForEvaluation = async function ({ language_id, source_code, stdin, token }) {
  try {
    const requestPayload = {
      language_id,
      source_code: encryptData(source_code),
      stdin: stdin ? encryptData(stdin) : null,
      token: token ? token : null
    }
  
    return await axios.request({
      method: 'POST',
      url: import.meta.env.VITE_REACT_APP_BACKEND_URL + '/code/submit',
      data: requestPayload
    })
  } catch (err) {
    return null;
  }
}

/**
 * Set data in localstorage in encrypted format
 * @param {string} key 
 * @param {string} value 
 */
export const setInLocalStorage = function (key, value) {
  if(!(key && value)) return;

  const keyEncrypted = encryptData(typeof key == 'string' ? key : key?.toString());
  const valueEncrypted = encryptData(typeof value == 'string' ? value : value?.toString());

  localStorage.setItem(keyEncrypted, valueEncrypted);
}

/**
 * Get data from localstorage (stored in encrypted format) 
 * @param {string} key 
 */
export const getFromLocalStorage = function (key) {
  if(!key) return null;

  const keyEncrypted = encryptData(typeof key == 'string' ? key : key?.toString());

  return decryptData(localStorage.getItem(keyEncrypted));
}

/**
 * Remove data from localstorage (stored in encrypted format) 
 * @param {string} key 
 */
export const removeFromLocalStorage = function (key) {
  if(!key) return null;

  const keyEncrypted = encryptData(typeof key == 'string' ? key : key?.toString());

  return localStorage.removeItem(keyEncrypted);
}