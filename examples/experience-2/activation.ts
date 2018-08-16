import experience from '../../src/experience'

export default function activation (options: any, cb: any) {
  const release = experience(options).register(['article-preview'], (slots: any) => {
    options.state.set('slots', slots)
    cb()
  })

  return { remove: release }
}
