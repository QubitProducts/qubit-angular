class HeroComponent {
  el: any
  oc: any

  constructor (el, originalContentEl) {
    this.el = el
    this.oc = originalContentEl
  }

  render () {
    this.el.style.padding = '100px'
    this.el.style.background = '#591bb3'
    this.el.style.color = 'white'
    this.el.style.textAlign = 'center'
    this.el.style.fontSize = '20px'

    const start = Date.now()
    const template = () => 'This is replaced by an experience (0 seconds ago)'
    this.el.innerHTML = template()
    setInterval(() => {
      this.el.innerHTML = `This is replaced by an experience (${Math.round((Date.now() - start) / 1000)} seconds ago)`
    }, 100)
  }

  onChange () {}

  onDestroy () {}
}

export {
  HeroComponent
}
