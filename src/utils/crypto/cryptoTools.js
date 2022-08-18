import CryptoJS from 'crypto-js';
/**
 * Add your secret key from your file in /src/sensitive.js
 */
import key from '../../sensitive';

const EncryptAES = word => {
  return CryptoJS?.AES?.encrypt(word, key)?.toString();
};

const DecryptAES = word => {
  return CryptoJS?.AES?.decrypt(word, key)?.toString(CryptoJS?.enc?.Utf8);
};

export {EncryptAES, DecryptAES};
