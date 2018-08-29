import { createObjectPath } from '../lib/createObjectPath'

const noop: any = () => {}

function experience (options: any = {}) {
  const log = options.log
  const getComponent = (id: string) => createObjectPath(window, ['__qubit', 'angular', 'components', id])

  return {
    register: function (ids: string[], cb: ((slots: any) => void)) {
      let claimed = false

      const alreadyClaimed = ids.find(id => {
        return getComponent(id).claimed
      })

      // one of the requested wrappers has already been
      // claimed by another experience
      if (alreadyClaimed) {
        return noop
      }

      ids.forEach((id) => {
        log && log.info(`[qubit-angular/experience] [${id}] registering`)
        const component = getComponent(id)
        claimed = true
        component.claimed = true
        component.instances = component.instances || []
      })

      const slots = {
        render: function render (id: string, ExperienceComponent: any) {
          const component = getComponent(id)
          component.ExperienceComponent = ExperienceComponent
          component.instances.forEach((i: any) => i.takeOver())
        },
        unrender: function unrender (id: string) {
          const component = getComponent(id)
          component.instances.forEach((i: any) => i.release())
        },
        release: release
      }

      cb && cb(slots)

      function release () {
        if (claimed) {
          claimed = false
          ids.forEach((id: string) => {
            const component = getComponent(id)
            component.claimed = false
            delete component.ExperienceComponent
            component.instances.forEach((i: any) => i.release())
            log && log.info(`[qubit-angular/experience] [${id}] released`)
          })
        }
      }

      return release
    }
  }
}

export default experience
