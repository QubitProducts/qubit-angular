import { ArticlePreviewComponent } from './utils'

export default function execution (options: any) {
  console.log('Running experience 2')
  const slots = options.state.get('slots')
  slots.render('article-preview', ArticlePreviewComponent)

  return {
    remove: slots.release
  }
}
