import {DependencyList, useLayoutEffect, useRef} from 'react';

/**
 * Executes the given effect function after the initial mount of the component and then on subsequent updates.
 * This hook is similar to useLayoutEffect, but skips the effect during the initial mount of the component.
 *
 * @param {() => void} effect - The effect function to be executed.
 * @param {DependencyList} [dependencies=[]] - An optional array of dependencies which triggers the effect.
 *
 * @example
 *
 * // Usage example
 * useUpdateLayoutEffect(() => {
 *    console.log("Component updated");
 * }, [propA, propB]);
 *
 */
export function useUpdateLayoutEffect(
  effect: () => void,
  dependencies: DependencyList = [],
) {
  const isInitialMount = useRef(true);
  useLayoutEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else {
      effect();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);
}
