/*
 * This is the source code of Moon Meet CrossPlatform.
 * It is licensed under GNU GPL v. 3.
 * You should have received a copy of the license in this archive (see LICENSE).
 *
 * Copyright Rayen sbai, 2021-2022.
 */

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
