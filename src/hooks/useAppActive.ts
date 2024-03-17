/*
 * This is the source code of Moon Meet CrossPlatform.
 * It is licensed under GNU GPL v. 3.
 * You should have received a copy of the license in this archive (see LICENSE).
 *
 * Copyright Rayen sbai, 2021-2022.
 */

import {useEffect} from 'react';
import {AppState, AppStateStatus} from 'react-native';

/**
 * Executes the provided function when the application becomes active.
 *
 * @param {Function} fn - The function to be executed when the application becomes active.
 * @param {Array} [dependencies] - An optional array of dependencies to be used by the effect. Any change in these dependencies will trigger the effect function to be re-executed.
 * @return {void} - This method does not return a value.
 */
export function useAppActive(fn: () => void, dependencies = []): void {
  const onChange = (state: AppStateStatus) => {
    if (state === 'active') {
      fn();
    }
  };

  useEffect(() => {
    const subscribe = AppState.addEventListener('change', onChange);

    return () => subscribe.remove();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);
}
