declare let window: any

export function log (...args: any[]) {
  if (typeof window !== 'undefined' && window.console) {
    if (window.__qubit && window.__qubit.angular && window.__qubit.angular.debug) {
      console.log(...args)
    }
  }
}

export function logError (...args: any[]) {
  if (typeof window !== 'undefined' && window.console) {
    if (window.__qubit && window.__qubit.angular && window.__qubit.angular.debug) {
      console.error(...args)
    }
  }
}
