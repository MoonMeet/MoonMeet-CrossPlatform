/*
 * This is the source code of Moon Meet CrossPlatform.
 * It is licensed under GNU GPL v. 3.
 * You should have received a copy of the license in this archive (see LICENSE).
 *
 * Copyright Rayen sbai, 2021-2022.
 */

/**
 *
 * @param text
 * @returns
 */
const lowerToUppercase = (text: string) => {
  if (!text || text?.length < 1) {
    return '';
  }
  return (text[0]?.toUpperCase() + text?.substring(1))?.trim();
};

export {lowerToUppercase};
