import { createObjectPath } from '../lib/createObjectPath'
import { log } from '../lib/log'

export default function experience (meta) {
  const isControl = meta.variationIsControl

  return {
    register: function (id, ExperienceComponent, cb) {
      log(`[qubit-angular/exp] [${id}] registering`)
      let claimed = false

      const component = createObjectPath(window, ['__qubit', 'angular', 'components', id])

      // the slot already claimed by another experience
      if (component.claimed) {
        return () => {}
      }

      claimed = true
      component.claimed = true
      component.isControl = isControl
      component.ExperienceComponent = ExperienceComponent
      component.instances = component.instances || []

      component.instances.forEach(i => {
        i.takeOver()
      })

      cb && cb()

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
