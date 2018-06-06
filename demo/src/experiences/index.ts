import experience1 from './experience-1'
import experience2 from './experience-2'
import experience3 from './experience-3'
import run from './run'

// simulate smartserve activating experiences
let cleanup = []

function start () {
  cleanup.push(run(experience1))
  cleanup.push(run(experience2))
  cleanup.push(run(experience3))
}

function stop () {
  cleanup.forEach(exp => exp.remove())
  cleanup = []
}

// simulate how smartserve handles ecViews
window['loadSmartserve'] = start
window['unloadSmartserve'] = stop

window['__qubit'] = window['__qubit'] || {}
window['__qubit']['angular'] = window['__qubit']['angular'] || {}
window['__qubit']['angular']['debug'] = true

window['uv'].on('ecView', () => {
  stop()
  start()
}).replay()
