import { createObjectPath } from '../lib/createObjectPath'

export default function experience (meta) {
  // TODO - don't render anything when in control,
  // but follow the same rules otherwise
  var isControl = meta.variationIsControl

  return {
    register: function (id, ExperienceComponent, cb) {
      console.log(`[qubit-angular/exp] [${id}] registering`)
      let claimed = false

      const component = createObjectPath(window, ['__qubit', 'angular', 'components', id])

      // the slot already claimed by another experience
      if (component.claimed) {
        return () => {}
      }

      claimed = true
      component.claimed = true
      component.ExperienceComponent = ExperienceComponent
      component.instances = component.instances || []

      component.instances.forEach(i => {
        i.takeOver()
      })

      return function release () {
        if (claimed) {
          claimed = false
          component.claimed = false
          delete component.ExperienceComponent
          component.instances.forEach(i => i.release())
        }
      }
    }
  }
}
