import { createObjectPath } from '../lib/createObjectPath'

export default function experience (meta) {
  var isControl = meta.variationIsControl

  return {
    register: function (id, Component, cb) {
      console.log(`[qubit-angular] Registering ${id}`)
      let claimed = false

      const component = createObjectPath(window, ['__qubit', 'angular', 'components', id])
      if (!component.owner) {
        component.owner = id
        component.Component = Component
        component.instances = []
        claimed = true

        // the run hook has already been provided
        // by the angular wrapper, call it, otherwise,
        // the hook will be initiated from angular side
        if (component.run) {
          console.log(`[qubit-angular] Calling component.run() for ${id} from experience side`)
          component.run()
        }
      }

      function release (options = {}) {
        console.log(`[qubit-angular] Releasing ${id}`)
        if (claimed) {
          // the destroy hook provided by
          // the angular wrapper
          if (component.destroy && !options.skipDestroy) {
            console.log(`[qubit-angular] Calling component.destroy() for ${id} from experience side`)
            component.destroy()
          }
          component.owner = null
          component.instances = []
          claimed = false
        }
      }

      component.release = release

      return release
    }
  }
}
