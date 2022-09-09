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
 * Called when the application from foreground to background
 * @public
 */
export function useAppInactive(fn: () => void): void {
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
  }, []);
}
