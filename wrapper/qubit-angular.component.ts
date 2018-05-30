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

  // when this component gets destroyed
  destroyed = false;

  constructor(cd: ChangeDetectorRef) {
    this.changeDetector = cd;
  }

  ngOnInit () {
    console.log(`[qubit-angular/wrp] [${this.id}] onOnInit`)
    if (this.disable) {
      return;
    }

    this.registerWithExperiences();
  }

  registerWithExperiences () {
    console.log(`[qubit-angular/wrp] [${this.id}] registerWithExperiences`)
    this.component = createObjectPath(window, ['__qubit', 'angular', 'components', this.id]);
    this.component.instances = this.component.instances || []
    this.component.instances.push(this);

    if (this.component.claimed) {
      this.takeOver();
    }
  }

  takeOver () {
    console.log(`[qubit-angular/wrp] [${this.id}] takeOver`);
    this.isExperienceActive = true;
    this.changeDetector.detectChanges();

    try {
      this.experience = new this.component.ExperienceComponent(
        this.outlet.nativeElement,
        this.original.nativeElement,
        this.data
      );
      this.experience.render();
    } catch (err) {
      console.error(`Starting the experience in id=${this.id} failed`, err);
      this.release();
    }
  }

  release () {
    console.log(`[qubit-angular/wrp] [${this.id}] release`)
    if (this.experience && this.experience.onDestroy) {
      try {
        this.experience.onDestroy();
      } catch (err) {
        console.error(`The onDestroy hook of experience ${this.id} failed`, err);
      }
    }

    this.experience = null;
    this.isExperienceActive = false;

    if (!this.destroyed) {
      this.changeDetector.detectChanges();
    }
  }

  ngOnChanges () {
    console.log(`[qubit-angular/wrp] [${this.id}] ngOnChanges`)
    if (this.disable && this.experience) {
      // we got switched off
      this.release();
    }

    if (this.experience && this.experience.onChanges) {
      this.experience.onChanges(this.data);
    }
  }

  ngDoCheck () {
    if (this.experience && this.experience.doCheck) {
      this.experience.doCheck(this.data);
    }
  }

  ngOnDestroy () {
    console.log(`[qubit-angular/wrp] [${this.id}] ngOnDestroy`)
    this.destroyed = true;
    this.component.instances = this.component.instances.filter(i => i !== this)
    this.release();
  }
}
