export default function run (experience: any) {
  const experienceOptions = {
    meta: {},
    state: {
      data: {},
      set: (key: string, val: any) => { experienceOptions.state.data[key] = val },
      get: (key: string) => experienceOptions.state.data[key]
    } as any,
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
