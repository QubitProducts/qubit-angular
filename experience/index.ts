import { each } from 'slapdash'
import { createObjectPath } from '../lib/createObjectPath'
import { log } from '../lib/log'

const noop: any = () => {}

export default function experience (options: any = {}) {
  const log = options.log

  if (!options.meta) {
    throw new Error('Please pass in the experience options object')
  }

  const isControl = options.meta.variationIsControl

  return {
    register: function (id, ExperienceComponent, cb) {
      log.info(`[qubit-angular/exp] [${id}] registering`)
      let claimed = false

      const component = createObjectPath(window, ['__qubit', 'angular', 'components', id])

      // the slot already claimed by another experience
      if (component.claimed) {
        return noop
      }

      log.info(`[qubit-angular/exp] [${id}] claimed`)
      claimed = true
      component.claimed = true
      component.isControl = isControl
      component.ExperienceComponent = ExperienceComponent
      component.instances = component.instances || []

      each(component.instances, i => {
        i.takeOver()
      })

      cb && cb()

      return function release () {
        if (claimed) {
          claimed = false
          component.claimed = false
          delete component.ExperienceComponent
          each(component.instances, i => i.release())
          log.info(`[qubit-angular/exp] [${id}] released`)
        }
      }
    }
  }
}
