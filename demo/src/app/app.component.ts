import { Component, OnInit, OnDestroy } from '@angular/core';

import { UserService } from './core';
import { QubitService } from './services/tracking/qubit.service'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit, OnDestroy {
  constructor (
    private userService: UserService,
    private qubitService: QubitService
  ) {}

  ngOnInit() {
    this.userService.populate();
    this.qubitService.subscribe();
  }

  ngOnDestroy() {
    // unsubscribe to the post
    this.qubitService.unsubscribe();
  }
}