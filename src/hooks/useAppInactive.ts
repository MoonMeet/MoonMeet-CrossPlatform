/*
 * This is the source code of Moon Meet CrossPlatform.
 * It is licensed under GNU GPL v. 3.
 * You should have received a copy of the license in this archive (see LICENSE).
 *
 * Copyright Rayen sbai, 2021-2022.
 */

import {useEffect} from 'react';
import {AppState, AppStateStatus, Platform} from 'react-native';

/**
 * Calls the provided function when the app becomes inactive or enters the background
 *
 * @param {function} fn - The function to be called when the app becomes inactive or enters the background
 * @param {Array} dependencies - (Optional) An array of dependencies that triggers the effect when changed
 * @return {void}
 */
export function useAppInactive(
  fn: () => void,
  dependencies: Array<any> = [],
): void {
  const onChange = (state: AppStateStatus) => {
    if (
      state ===
      Platform.select({
        ios: 'inactive',
        android: 'background',
      })
    ) {
      fn();
    }
  };

  useEffect(() => {
    const subscribe = AppState.addEventListener('change', onChange);

    return () => subscribe.remove();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);
}
