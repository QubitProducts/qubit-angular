# qubit-angular

Smoothly integrate Qubit Experiences on Angular websites.

Wrap page components using qubit-angular/wrapper and change their rendering behaviour from within Experiences to provide segment targeting, personalisation and A/B testing.

## Website Implementation

To expose a component for use in Experiences, wrap the relevant components with qubit-Angular/wrapper.

First declare the `QubitAngularComponent` in your app.

```js
import { QubitAngularComponent } from 'qubit-angular/wrapper';

@NgModule({
  declarations: [
    AppComponent,
    FooterComponent,
    // ...
    QubitAngularComponent
  ],
  imports: [],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
```

And then wrap the relevant parts of your site.

```js
<div>
  <qubit-angular id='header'>
    <app-header></app-header>
  </qubit-angular>
</div>
```

## Experience Implementation

In Qubit Experiences use `qubit-angular/experience` to interact with the wrappers.

First initiate the library by passing in the experience meta information.

```js
module.exports = function experienceActivation (options, cb) {
  const experience = require('qubit-angular/experience')(options.meta)
}
```

Qubit Angular has a concept of wrapper ownership. This means that only a single experience can control the contents of a given wrapper id at any given time. This reduces conflicts between experiences attempting to modify the same component.

In order to take ownership of a wrapper during the experience activation phase, use the `experience.register` function. You can claim multiple wrappers by passing in multiple wrapper IDs to register.

```js
module.exports = function experienceActivation (options, cb) {
  const experience = require('qubit-angular/experience')(options.meta)

  // this is the alternative component Header implementation
  // we'll render instead of the existing slot content
  const { NewHeader } = require('./utils')

  const release = experience.register('header', NewHeader, cb)

  return {
    // important to release the ownership of the wrappers
    // so that other experiences on other virtual pageviews
    // can claim them.
    remove: release
  }
}
```

Here's your component implementation, which is kept in `utils.js`.

```js
module.exports.NewHeader = class NewHeader {
  constructor (el) {
    this.el = el
  }
  render () {
    return this.el.innerHTML = 'NEW HEADER'
  }
  onDestroy () {
    // cleanup if necessary, e.g. unbind event listeners
  }
}
```

## How does this work?

By default, the `<qubit-angular>` transparently renders all of the children components using `<ng-content>`. But when experience claims the wrapper, it switches to rendering alternative content into an angular managed `div` controlled by the experience. It cleans up and restores everything to how it was if experience is unrendered.
