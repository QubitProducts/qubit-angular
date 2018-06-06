declare let window: any

export function log (...args) {
  if (typeof window !== 'undefined' && window.console) {
    if (window.__qubit && window.__qubit.angular && window.__qubit.angular.debug) {
      console.log(...args)
    }
  }
}
