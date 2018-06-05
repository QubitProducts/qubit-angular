import {
  Component,
  OnInit,
  OnChanges,
  DoCheck,
  OnDestroy,
  ElementRef,
  ViewChild,
  Input,
  ChangeDetectorRef
} from '@angular/core'

import { createObjectPath } from '../lib/createObjectPath'
import { log } from '../lib/log'
import { filter } from 'slapdash'

declare let window: any

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
export class QubitAngularComponent implements OnInit, OnChanges, DoCheck, OnDestroy {

  // toggles when the experience takes over
  isExperienceActive = false

  // the experience references this angular component
  // by this string id
  @Input() private id

  // it's possible to disable each individual angular
  // component from being taken over by the experience
  // by setting disable to true
  @Input() private disable

  // this is arbitrary data that can be passed to this
  // component that will get passed to the experience
  @Input() private data: any

  // this is the DOM element that will get passed to the
  // experience as the container for all of it's work
  @ViewChild('outlet') private outlet: ElementRef
  @ViewChild('original') private original: ElementRef

  // private window: Window

  // the experience component API on window
  private component = null

  // the experience component instance
  private experience = null

  // private changeDetector: ChangeDetectorRef

  // when this component gets destroyed
  private destroyed = false

  constructor (
    // used to detect changes when the experience
    // code initiates state changes
    private changeDetector: ChangeDetectorRef
  ) {}

  ngOnInit () {
    log(`[qubit-angular/wrp] [${this.id}] onOnInit`)
    if (this.disable) {
      log(`[qubit-angular/wrp] [${this.id}] disabled`)
      return
    }

    this.registerWithExperiences()
  }

  registerWithExperiences () {
    log(`[qubit-angular/wrp] [${this.id}] registerWithExperiences`)
    this.component = createObjectPath(window, ['__qubit', 'angular', 'components', this.id])

    if (this.component.isControl) {
      log(`[qubit-angular/wrp] [${this.id}] in control - not doing anything`)
      return
    }

    this.component.instances = this.component.instances || []
    this.component.instances.push(this)

    if (this.component.claimed) {
      this.takeOver()
    }
  }

  takeOver () {
    log(`[qubit-angular/wrp] [${this.id}] takeOver`)
    this.isExperienceActive = true
    this.changeDetector.detectChanges()

    try {
      this.experience = new this.component.ExperienceComponent(
        this.outlet.nativeElement,
        this.original.nativeElement,
        this.data
      )
      this.experience.render()
    } catch (err) {
      if (window.console) {
        window.console.error(`Starting the experience in id=${this.id} failed`, err)
      }
      this.release()
    }
  }

  release () {
    log(`[qubit-angular/wrp] [${this.id}] release`)
    if (this.experience && this.experience.onDestroy) {
      try {
        this.experience.onDestroy()
      } catch (err) {
        if (window.console) {
          window.console.error(`The onDestroy hook of experience ${this.id} failed`, err)
        }
      }
    }

    this.experience = null
    this.isExperienceActive = false

    if (!this.destroyed) {
      this.changeDetector.detectChanges()
    }
  }

  ngOnChanges () {
    if (this.disable && this.experience) {
      log(`[qubit-angular/wrp] [${this.id}] has been disabled`)
      this.release()
    }

    if (this.experience && this.experience.onChanges) {
      this.experience.onChanges(this.data)
    }
  }

  ngDoCheck () {
    if (this.experience && this.experience.doCheck) {
      this.experience.doCheck(this.data)
    }
  }

  ngOnDestroy () {
    log(`[qubit-angular/wrp] [${this.id}] ngOnDestroy`)
    this.destroyed = true
    this.component.instances = filter(this.component.instances, i => i !== this)
    this.release()
  }
}
