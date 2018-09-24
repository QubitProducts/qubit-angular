// This is to appease typescript
// Or more specifically, this is to avoid having to type:
// `require('qubit-angular/experience').default`
// by splitting experience file into esm.js and index.js, we can import
// it in TypeScript code in demo dir as ES6 import with `import '../../experience/esm'`
// and import in experiences as CJS require with `require('qubit-angular/experience')`
import experience from './esm'
export = experience
