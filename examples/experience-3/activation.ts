import experience from '../../src/experience/esm'

export default function activation (options: any, cb: any) {
  const release = experience(options).register(['article-hero'], (slots: any) => {
    options.state.set('slots', slots)
    cb()
  })

  return { remove: release }
}
