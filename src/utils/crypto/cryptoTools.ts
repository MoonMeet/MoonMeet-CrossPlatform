/*
 * This is the source code of Moon Meet CrossPlatform.
 * It is licensed under GNU GPL v. 3.
 * You should have received a copy of the license in this archive (see LICENSE).
 *
 * Copyright Rayen sbai, 2021-2022.
 */

import CryptoJS from 'crypto-js';
import {EncryptionKey} from '../../secrets/sensitive';

/**
 * Add your secret key from your file in /src/sensitive.js
 */

const EncryptAES = (word: string) => {
  return CryptoJS?.AES?.encrypt(word, EncryptionKey)?.toString();
};

const DecryptAES = (word: string) => {
  return CryptoJS?.AES?.decrypt(word, EncryptionKey)?.toString(
    CryptoJS?.enc?.Utf8,
  );
};

export {EncryptAES, DecryptAES};
