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
    <div *ngIf="!isExperienceActive">
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
  @Input() data;

  // this is the DOM element that will get passed to the
  // experience as the container for all of it's work
  @ViewChild('outlet') outlet: ElementRef;

  // the reference to the experience component
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
    if (this.disable) {
      return;
    }
    this.registerWithExperienceComponent();
  }

  getExperienceComponent () {
    return createObjectPath(window, ['__qubit', 'angular', 'components', this.id]);
  }

  registerWithExperienceComponent () {
    const component = this.getExperienceComponent();
    component.run = () => this.runExperience();
    component.destroy = () => this.destroyExperience();
  }

  runExperience () {
    const component = this.getExperienceComponent();
    if (component.owner) {
      this.isExperienceActive = true;
      this.changeDetector.detectChanges();

      try {
        this.experience = new component.Component(this.outlet.nativeElement);
        this.experience.render();
      } catch (err) {
        console.log(`Starting the experience in id=${this.id} failed`, err);
        this.destroyExperience();
      }
    }
  }

  destroyExperience () {
    if (this.experience && this.experience.onDestroy) {
      try {
        this.experience.onDestroy();
      } catch (err) {
        console.log(err);
      }
    }
    this.experience = null;
    this.isExperienceActive = false;
    this.changeDetector.detectChanges();
  }

  ngOnChanges () {
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
    if (this.experience) {
      this.destroyExperience();
    }
  }
}
