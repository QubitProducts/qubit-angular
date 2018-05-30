import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common'

import { QubitAngularComponent } from './qubit-angular.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    QubitAngularComponent
  ],
  exports: [
    QubitAngularComponent
  ]
})
export class QubitAngularModule {}
