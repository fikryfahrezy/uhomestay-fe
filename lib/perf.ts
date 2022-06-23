/**
 * Ref: How to Implement Debounce and Throttle with JavaScript
 * https://webdesign.tutsplus.com/tutorials/javascript-debounce-and-throttle--cms-36783
 *
 * Ref: martinstark/throttle-ts
 * https://github.com/martinstark/throttle-ts/blob/main/src/index.ts
 */
export const throttle = <R, A extends unknown[]>(
  callback: (...args: A) => R,
  time: number
) => {
  //initialize throttlePause variable outside throttle function
  let throttlePause = false;

  const throttler = (...args: A) => {
    //don't run the function if throttlePause is true
    if (throttlePause) {
      return;
    }

    //set throttlePause to true after the if condition. This allows the function to be run once
    throttlePause = true;

    //setTimeout runs the callback within the specified time
    setTimeout(() => {
      callback(...args);

      //throttlePause is set to false once the function has been called, allowing the throttle function to loop
      throttlePause = false;
    }, time);
  };

  return throttler;
};

/**
 * Ref: How to Implement Debounce and Throttle with JavaScript
 * https://webdesign.tutsplus.com/tutorials/javascript-debounce-and-throttle--cms-36783
 */
export const debounce = <R, A extends unknown[]>(
  callback: (...args: A) => R,
  time: number
) => {
  let debounceTimer: undefined | number;

  const debouncer = (...args: A) => {
    window.clearTimeout(debounceTimer);
    debounceTimer = window.setTimeout(() => {
      callback(...args);
    }, time);
  };

  return debouncer;
};
