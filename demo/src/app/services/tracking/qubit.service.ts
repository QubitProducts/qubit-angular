import { Injectable } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { Router, NavigationEnd } from '@angular/router';

declare let uv: { emit: Function };

@Injectable()
export class QubitService {
  private subscription: Subscription;

  constructor(
    private router: Router
  ) {}

  public subscribe() {
    if (!this.subscription) {
      this.subscription = this.router.events.subscribe( e => {
        if (e instanceof NavigationEnd) {
          uv.emit('ecView')
        }
      });
    }
  }

  public unsubscribe() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}