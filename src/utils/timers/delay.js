/*
 * This is the source code of Moon Meet CrossPlatform.
 * It is licensed under GNU GPL v. 3.
 * You should have received a copy of the license in this archive (see LICENSE).
 *
 * Copyright Rayen sbai, 2021-2022.
 */

const waitForAnd = millis =>
  new Promise(toResolve => setTimeout(toResolve, millis));

export {waitForAnd};
