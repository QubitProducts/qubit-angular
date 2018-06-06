import experience from '../../../../src/experience'

export default function activation (options, cb) {
  const release = experience(options).register(['hero'], (slots) => {
    options.state.set('slots', slots)
    cb()
  })

  return { remove: release }
}
