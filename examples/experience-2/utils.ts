class ArticlePreviewComponent {
  el: any
  oc: any
  article: any
  title: string

  constructor (el: any, originalContentEl: any, article: any) {
    this.el = el
    this.oc = originalContentEl
    this.article = article
    this.title = this.article.title
  }

  render () {
    this.el.innerHTML = `<div><h1>${this.title}</h1><span style=''>This title is wrapped by an experience</span></div>`
    this.el.querySelector('div').style.border = '3px solid rgb(89, 27, 179)'
    this.el.querySelector('div').style.color = 'rgb(89, 27, 179)'
    this.el.querySelector('div').style.display = 'inline-block'
    this.el.querySelector('div').style.padding = '5px'
    this.el.querySelector('div').style.margin = '10px 0'

    this.el.querySelector('span').style.color = 'rgb(89, 27, 179)'
  }

  onChanges () {
    this.render()
  }

  doCheck () {
    if (this.title !== this.article.title) {
      this.title = this.article.title
      this.render()
    }
  }

  onDestroy () {}
}

export {
  ArticlePreviewComponent
}
