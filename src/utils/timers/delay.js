const waitForAnd = millis =>
  new Promise(toResolve => setTimeout(toResolve, millis));

export {waitForAnd};
