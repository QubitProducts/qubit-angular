// inside an experience

// import the experience module
import experience from '../../../qubit-angular/experience'

function experience1 () {
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
      const template = () => 'I have been rendered for 0 seconds'
      this.el.innerHTML = template()
      setInterval(() => {
        this.el.innerHTML = `I have been rendered for ${Math.round((Date.now() - start) / 1000)} seconds`
      }, 100)
    }

    onChange () {}

    onDestroy () {}
  }

  const remove = experience({ }).register('hero', HeroComponent, () => {
    console.log('Activated experience 1')
    // cb()
  })

  return {
    remove
  }
}

function experience2 () {
  class ArticleComponent {
    el: any
    oc: any

    constructor (el, originalContentEl) {
      this.el = el
      this.oc = originalContentEl
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

  return {
    remove: () => {}
  }
}

function experience3 () {
  class ArticleHeroComponent {
    el: any
    interval: any

    constructor (el) {
      this.el = el
    }

    render () {
      this.el.style.padding = '20px'
      this.el.style.margin = '5px'
      this.el.style.background = '#591bb3'
      this.el.style.color = 'white'
      this.el.style.textAlign = 'center'
      this.el.style.fontSize = '20px'

      const start = Date.now()
      const template = () => `I am an article hero and have been rendered for ${Math.round((Date.now() - start) / 1000)} seconds`

      this.interval = setInterval(() => {
        this.el.innerHTML = template()
      }, 100)
      this.el.innerHTML = template()
    }

    onDestroy () {
      clearInterval(this.interval)
    }
  }

  const remove = experience({ }).register('article-hero', ArticleHeroComponent, () => {
    console.log('Activated experience 3')
    // cb()
  })

  return {
    remove: remove
  }
}







// simulate smartserve activating experiences
let cleanup = []

function start () {
  cleanup.push(experience1())
  // cleanup.push(experience2())
  // cleanup.push(experience3())
}

function stop () {
  cleanup.forEach(exp => exp.remove())
  cleanup = []
}







// simulate how smartserve handles ecViews
window['loadSmartserve'] = start
window['unloadSmartserve'] = stop


window['uv'].on('ecView', () => {
  stop()
  start()
}).replay()
