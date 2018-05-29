// inside an experience

// import the experience module
import experience from '../../../qubit-angular/experience'

class HeroComponent {
  el: any

  constructor (el) {
    this.el = el
  }

  render () {
    this.el.innerHTML = 'I have been rendered for 0 seconds'
    this.el.style.padding = '100px'
    this.el.style.background = '#591bb3'
    this.el.style.color = 'white'
    this.el.style.textAlign = 'center'
    this.el.style.fontSize = '20px'

    const start = Date.now()
    setInterval(() => {
      this.el.innerHTML = `I have been rendered for ${Math.round((Date.now() - start) / 1000)} seconds`
    }, 100)
  }

  onChange () {}

  onDestroy () {}
}

let dispose

window['fakeLoadSmartserve'] = () => {
  dispose = experience({ }).register('hero', HeroComponent)
}

window['stop'] = () => {
  dispose()
}
