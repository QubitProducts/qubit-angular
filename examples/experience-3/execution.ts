import { ArticleHeroComponent } from './utils'

export default function execution (options) {
  console.log('Running experience 3')
  const slots = options.state.get('slots')
  slots.render('article-hero', ArticleHeroComponent)

  return {
    remove: slots.release
  }
}
