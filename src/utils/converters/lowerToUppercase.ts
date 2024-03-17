/*
 * This is the source code of Moon Meet CrossPlatform.
 * It is licensed under GNU GPL v. 3.
 * You should have received a copy of the license in this archive (see LICENSE).
 *
 * Copyright Rayen sbai, 2021-2022.
 */

/**
 * Converts the first character of a string to uppercase
 * and returns the resulting string with leading and trailing spaces removed.
 * If the input string is empty or null, an empty string is returned.
 *
 * @param {string} text - The input string to be converted.
 * @returns {string} - The converted string.
 */
const lowerToUppercase = (text: string): string => {
  if (!text || text?.length < 1) {
    return '';
  }
  return (text[0]?.toUpperCase() + text?.substring(1))?.trim();
};

export {lowerToUppercase};
