class ArticleHeroComponent {
  el: any
  interval: any

  constructor (el: any) {
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
    const template = () => `This is an extra article hero rendered by an experience (${Math.round((Date.now() - start) / 1000)} seconds ago)`

    this.interval = setInterval(() => {
      this.el.innerHTML = template()
    }, 100)
    this.el.innerHTML = template()
  }

  onDestroy () {
    clearInterval(this.interval)
  }
}

export {
  ArticleHeroComponent
}
