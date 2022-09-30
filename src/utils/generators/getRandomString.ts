/*
 * This is the source code of Moon Meet CrossPlatform.
 * It is licensed under GNU GPL v. 3.
 * You should have received a copy of the license in this archive (see LICENSE).
 *
 * Copyright Rayen sbai, 2021-2022.
 */

function getRandomString(length: number) {
  const randomChars: string =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result: string = '';
  for (let i: number = 0; i < length; i++) {
    result += randomChars?.charAt(
      Math?.floor(Math?.random() * randomChars?.length),
    );
  }
  return result;
}

export {getRandomString};
