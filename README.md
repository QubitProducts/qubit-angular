# qubit-angular

Smoothly integrate Qubit Experiences on Angular websites.

Wrap or inject page components using `qubit-angular/wrapper` and change their rendering behaviour from within Experiences to provide segment targeting, personalisation and A/B testing.

## Installation

Install from npm.

    npm install --save qubit-angular

## Angular compatibility

The package is compatible with Angular versions 2 to 6.

## Website Implementation

To expose a component for use in Experiences, wrap the relevant site components with `<qubit-angular>` component.

First import the `QubitAngularModule` in each module where you will be using the `<qubit-angular>` component.

```js
import { QubitAngularModule } from 'qubit-angular/wrapper';

@NgModule({
  declarations: [],
  imports: [ QubitAngularModule ],
  providers: [],
  bootstrap: [ AppComponent ]
})
export class AppModule {}
```

Now you can use the `<qubit-angular>` component. Specify the `id` attribute for Qubit experiences to reference when taking over. Optionally specify the `data` attribute to pass some data to the experience, could be a product, user, or any other data you think might be relevant for this experience.

```js
<div>
  <qubit-angular id="header" [data]="trip">
    <app-header></app-header>
  </qubit-angular>
</div>
```

Alternatively, it's possible to add the `<qubit-angular>` component without wrapping existing content. By default they won't show anything, but could then be used by Qubit experiences to inject new content.

```js
<div>
  <app-content></app-content>
  <qubit-angular id="campaign"></qubit-angular>
</div>
```

## Experience Implementation

After the site has been setup with at least one wrapper component, we can move to integrating from Qubit Experiences by using the `qubit-angular/experience` module.

First initiate the library in the experience activation by passing in the experience meta information.

```js
module.exports = function experienceActivation (options, cb) {
  const experience = require('qubit-angular/experience')(options)
}
```

Qubit Angular uses a concept of wrapper ownership. This means that only a single experience can control the contents of a given wrapper id at any given time. This removes conflicts between experiences attempting to modify the same component.

In order to take ownership of a wrapper during the experience activation phase, use the `experience.register` function.

```js
module.exports = function experienceActivation (options, cb) {
  const experience = require('qubit-angular/experience')(options)

  const release = experience.register(['header'], (slots) => {
    options.state.set('slots', slots)
    cb()
  })

  return {
    // important to release the ownership of the wrappers
    // so that other experiences on other virtual pageviews
    // can claim them.
    remove: release
  }
}
```

And in the experience execution, we can now render alternative content into the registered slots:

```js
module.exports = function experienceExecution (options) {
  const { NewHeader } = require('./utils')
  const slots = options.get('slots')

  slots.render('header', NewHeader)

  // unrender, if you only wanted to render the new content temporarily
  slots.unrender('header', NewHeader)

  return {
    remove: slots.release
  }
}
```

Here's the `NewHeader` component implementation, which is kept in `utils.js`. It's not an angular component, but a simple JavaScript class with `constructor` `render` method and some lifecycle hooks.

- `constructor` - gets passed a DOM element reference `el` which it can use to render whatever content in. It also gets originalEl with original content that it can use to read information from. Finally, `data` if data was passed to the wrapper component.
- `render` - only called once, right after instantiating the component, it should use the DOM element passed in the constructor to render content and attach event listeners.
- `onChanges` - called when bound data changes.
- `doCheck` - if a nested data attribute changes and not the whole object, `onChanges` will not detect that change and so you can use `doCheck` hook to detect changes manually
- `onDestroy` - called once when component is unmounted from the DOM, use it to perform cleanup - clear timers, remove event listeners, etc.

the `onChanges`, `doCheck` and `onDestroy` hooks are equivalents of `ngOnChanges`, `ngDoCheck` and `ngOnDestroy` hooks documented in the [official Angular docs](https://angular.io/guide/lifecycle-hooks#lifecycle-sequence).

```js
module.exports.NewHeader = class NewHeader {
  constructor (el, originalEl, data) {
    this.el = el
    this.originalEl = originalEl
    this.data = data
  }
  render () {
    return this.el.innerHTML = 'NEW HEADER'
  }
  onChanges () {
    // if the data passed in changed
  }
  doCheck () {
    // onChanges will not always detect changes automatically
    // use this to manually check if this.data changed, and rerender
    // e.g.
    if (this.title != this.data.title) {
      this.title = this.data.title;
      this.render();
    }
  }
  onDestroy () {
    // cleanup if necessary, e.g. unbind event listeners
  }
}
```

## How does this work?

By default, the `<qubit-angular>` transparently renders all of the children components using `<ng-content>`. But when experience claims the wrapper, it hides the `<ng-content>` and reveals a `<div #outlet>` - a DOM element that is passed by reference to an experience. On a route change, or state change, if the component containing `<qubit-angular>` is removed, the experience gets a chance to cleanup via an `onDestroy` lifecycle hook and the ownership of the wrapper is released.

## Debugging

Set `__qubit.angular.debug = true` to see additional logging output about the state and lifecycles of the wrapper components.

## Points of interest

The implementation of the <qubit-angular> component and module is over here:

  * [wrapper/qubit-angular.component.ts](wrapper/qubit-angular.component.ts)
  * [wrapper/qubit-angular.module.ts](wrapper/qubit-angular.module.ts)

The implementation of the experience registration hook is here:

  * [experience/index.ts](experience/index.ts)

## Demo

To run this locally and see how it works, use the included demo project.

```
1. git clone git@github.com:QubitProducts/qubit-angular.git
2. cd qubit-angular/demo
3. npm install
4. npm start
5. open http://localhost:4200
```

You should see a green themed website with some purple elements being controlled by the wrappers. See [demo/src/experiences/index.ts](demo/src/experiences/index.ts) to see how the wrappers are used to render alternative content.

Run the following in console to simulate what happens when Qubit smartserve is off or on:

```
window.unloadSmartserve()
window.loadSmartserve()
```

## Releasing

To release a new version of the package, run

```
npm run release
```
