import  { createObjectPath } from '../lib/createObjectPath'

export default function experience (meta) {
  var isControl = meta.variationIsControl

  return {
    register: function (id, Component, cb) {
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
          component.run()
        }
      }

      return function release () {
        if (claimed) {
          // the destroy hook provided by
          // the angular wrapper
          if (component.destroy) {
            component.destroy()
          }
          component.owner = null
          component.instances = []
          claimed = false
        }
      }
    }
  }
}
