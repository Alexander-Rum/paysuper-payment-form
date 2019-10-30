/**
 * Guarantees the callback will be called no sooner than the promise in resolved
 */
export default async function useDelayedCallbackOnPromise(promise, callback, delay) {
  let isTimeOut = false;
  let isPromiseResolved = false;
  let result;
  setTimeout(() => {
    isTimeOut = true;
    if (isPromiseResolved) {
      callback(result);
    }
  }, delay);

  result = await promise;
  isPromiseResolved = true;
  if (isTimeOut) {
    callback(result);
  }
  return result;
}
