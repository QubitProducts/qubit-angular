import { ModuleWithProviders, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { HomeComponent } from './home.component';
import { HomeAuthResolver } from './home-auth-resolver.service';
import { SharedModule } from '../shared';
import { HomeRoutingModule } from './home-routing.module';
import { QubitAngularComponent } from '../../../../../qubit-angular/wrapper/qubit-angular.component';

@NgModule({
  imports: [
    SharedModule,
    HomeRoutingModule
  ],
  declarations: [
    HomeComponent,
    QubitAngularComponent
  ],
  providers: [
    HomeAuthResolver
  ]
})
export class HomeModule {}
