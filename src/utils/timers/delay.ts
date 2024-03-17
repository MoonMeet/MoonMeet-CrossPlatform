/*
 * This is the source code of Moon Meet CrossPlatform.
 * It is licensed under GNU GPL v. 3.
 * You should have received a copy of the license in this archive (see LICENSE).
 *
 * Copyright Rayen sbai, 2021-2022.
 */

/**
 * Waits for a specified number of milliseconds before resolving the promise.
 *
 * @param {number} millis - The number of milliseconds to wait.
 * @returns {Promise} - A promise that resolves after the specified milliseconds.
 */
const waitForAnd = (millis: number): Promise<any> =>
  new Promise(toResolve => setTimeout(toResolve, millis));

export {waitForAnd};
