import {
  Component,
  OnInit,
  OnChanges,
  OnDestroy,
  ElementRef,
  ViewChild,
  Input,
  ChangeDetectorRef
} from '@angular/core';

import { createObjectPath } from '../lib/createObjectPath'

@Component({
  selector: 'qubit-angular',
  template: `
    <div #original [hidden]="isExperienceActive">
      <ng-content></ng-content>
    </div>
    <div *ngIf="isExperienceActive">
      <div #outlet></div>
    </div>
  `
})
export class QubitAngularComponent implements OnInit, OnChanges, OnDestroy {

  // the experience references this angular component
  // by this string id
  @Input() id;

  // it's possible to disable each individual angular
  // component from being taken over by the experience
  // by setting disable to true
  @Input() disable;

  // this is arbitrary data that can be passed to this
  // component that will get passed to the experience
  @Input() data: any;

  // this is the DOM element that will get passed to the
  // experience as the container for all of it's work
  @ViewChild('outlet') outlet: ElementRef;
  @ViewChild('original') original: ElementRef;

  // the experience component API on window
  component = null;

  // the experience component instance
  experience = null;

  // toggles when the experience takes over
  isExperienceActive = false;

  // used to detect changes when the experience
  // code initiates state changes
  changeDetector: ChangeDetectorRef;

  constructor(cd: ChangeDetectorRef) {
    this.changeDetector = cd;
  }

  ngOnInit () {
    console.log(`[qubit-angular] onOnInit ${this.id}`)
    if (this.disable) {
      return;
    }

    this.registerWithExperienceComponent();
  }

  registerWithExperienceComponent () {
    console.log(`[qubit-angular] registerWithExperienceComponent ${this.id}`)
    this.component = createObjectPath(window, ['__qubit', 'angular', 'components', this.id]);
    this.component.run = () => this.runExperience();
    this.component.destroy = () => this.destroyExperience();

    if (this.component.owner) {
      this.component.run()
    }
  }

  runExperience () {
    console.log(`[qubit-angular] runExperience ${this.id}`)
    if (this.component.owner) {
      this.isExperienceActive = true;
      this.changeDetector.detectChanges();

      try {
        this.experience = new this.component.Component(
          this.outlet.nativeElement,
          this.original.nativeElement,
          this.data
        );
        this.experience.render();
      } catch (err) {
        console.log(`Starting the experience in id=${this.id} failed`, err);
        this.destroyExperience();
      }
    }
  }

  destroyExperience (options: any = {}) {
    console.log(`[qubit-angular] destroyExperience ${this.id}`)
    if (this.experience && this.experience.onDestroy) {
      try {
        this.experience.onDestroy();
      } catch (err) {
        console.log(`The onDestroy hook of experience ${this.id} failed`, err);
      }
    }
    if (this.component) {
      this.component.release({ skipDestroy: true })
    }
    this.experience = null;
    this.isExperienceActive = false;
    if (!options.destroyedView) {
      this.changeDetector.detectChanges();
    }
  }

  ngOnChanges () {
    console.log(`[qubit-angular] ngOnChanges ${this.id}`)
    if (this.disable) {
      if (this.experience) {
        this.destroyExperience();
      }
    }

    if (this.experience && this.experience.onChange) {
      this.experience.onChange(this);
    }
  }

  ngOnDestroy () {
    console.log(`[qubit-angular] ngOnDestroy ${this.id}`)
    this.destroyExperience({ destroyedView: true });
  }
}
