import { Component, Input } from '@angular/core';

import { Article } from '../../core';

@Component({
  selector: 'app-article-preview',
  templateUrl: './article-preview.component.html'
})
export class ArticlePreviewComponent {
  @Input() article!: Article;

  onChangeTitle () {
    this.article.title = this.article.title.split(' // ')[0]
    this.article.title = this.article.title + ' // ' + Math.random()
  }

  onToggleFavorite(favorited: boolean) {
    this.article['favorited'] = favorited;

    if (favorited) {
      this.article['favoritesCount']++;
    } else {
      this.article['favoritesCount']--;
    }
  }
}
