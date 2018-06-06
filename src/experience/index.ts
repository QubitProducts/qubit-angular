import { each, find } from 'slapdash'
import { createObjectPath } from '../lib/createObjectPath'

const noop: any = () => {}

export default function experience (options: any = {}) {
  const log = options.log
  const getComponent = id => createObjectPath(window, ['__qubit', 'angular', 'components', id])

  return {
    register: function (ids, cb) {
      let claimed = false

      const alreadyClaimed = find(ids, (id) => {
        return getComponent(id).claimed
      })

      // one of the requested wrappers has already been
      // claimed by another experience
      if (alreadyClaimed) {
        return noop
      }

      each(ids, (id) => {
        log && log.info(`[qubit-angular/experience] [${id}] registering`)
        const component = getComponent(id)
        claimed = true
        component.claimed = true
        component.instances = component.instances || []
      })

      const slots = {
        render: function render (id, ExperienceComponent) {
          const component = getComponent(id)
          component.ExperienceComponent = ExperienceComponent
          each(component.instances, i => i.takeOver())
        },
        unrender: function unrender (id) {
          const component = getComponent(id)
          each(component.instances, i => i.release())
        },
        release: release
      }

      cb && cb(slots)

      function release () {
        if (claimed) {
          claimed = false
          each(ids, id => {
            const component = getComponent(id)
            component.claimed = false
            delete component.ExperienceComponent
            each(component.instances, i => i.release())
            log && log.info(`[qubit-angular/experience] [${id}] released`)
          })
        }
      }

      return release
    }
  }
}
