export default function run (experience) {
  const experienceOptions = {
    meta: {},
    state: {
      data: {},
      set: (key, val) => { experienceOptions.state.data[key] = val },
      get: (key) => experienceOptions.state.data[key]
    },
    log: {
      info: console.log
    }
  }

  let exp

  exp = experience.activation(experienceOptions, () => {
    exp = experience.execution(experienceOptions)
  })

  return exp
}
