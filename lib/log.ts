declare let window: any

export function log (...args) {
  if (window && window.__qubit && window.__qubit.angular && window.__qubit.angular.debug) {
    if (window.console) {
      console.log(...args)
    }
  }
}