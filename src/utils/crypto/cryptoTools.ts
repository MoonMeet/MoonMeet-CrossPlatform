/*
 * This is the source code of Moon Meet CrossPlatform.
 * It is licensed under GNU GPL v. 3.
 * You should have received a copy of the license in this archive (see LICENSE).
 *
 * Copyright Rayen sbai, 2021-2022.
 */

import CryptoJS from 'crypto-js';
import {EncryptionKey} from 'secrets/sensitive';

/**
 * Add your secret key from your file in /src/sensitive.ts
 */

/**
 * Encrypts a word using AES encryption with a specified encryption key.
 * @param {string} word - The word to be encrypted.
 * @returns {string} - The encrypted word.
 */
const EncryptAES = (word: string): string => {
  return CryptoJS?.AES?.encrypt(word, EncryptionKey)?.toString();
};

/**
 * DecryptAES - Decrypts a string using AES encryption
 *
 * @param {string} word - The input string to be decrypted
 * @returns {string} - The decrypted string, or `undefined` if decryption fails
 */
const DecryptAES = (word: string): string => {
  return CryptoJS?.AES?.decrypt(word, EncryptionKey)?.toString(
    CryptoJS?.enc?.Utf8,
  );
};

export {EncryptAES, DecryptAES};
