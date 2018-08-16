import { HeroComponent } from './utils'

export default function execution (options: any) {
  console.log('Running experience 1')
  const slots = options.state.get('slots')
  slots.render('hero', HeroComponent)

  return {
    remove: slots.release
  }
}
