import CryptoJS from 'crypto-js';
/**
 * Add your secret key from your file in /src/sensitive.js
 */
import key from '../../sensitive';

const EncryptAES = word => {
  try {
    return CryptoJS?.AES?.encrypt(word, key)?.toString();
  } catch {
    return "We're sorry, we can't encrypt this for you.";
  }
};

const DecryptAES = word => {
  try {
    return CryptoJS?.AES?.decrypt(word, key)?.toString(CryptoJS?.enc?.Utf8);
  } catch {
    return "We're sorry, we can't decrypt this for you.";
  }
};

export {EncryptAES, DecryptAES};
