import {
  PLATFORM_ID,
  Component,
  OnInit,
  OnChanges,
  DoCheck,
  OnDestroy,
  ElementRef,
  ViewChild,
  Input,
  ChangeDetectorRef,
  Inject
} from '@angular/core'
import { isPlatformBrowser } from '@angular/common'

import { createObjectPath } from '../lib/createObjectPath'
import { log, logError } from '../lib/log'

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
  @Input() private id!: string

  // it's possible to disable each individual angular
  // component from being taken over by the experience
  // by setting disable to true
  @Input() private disable: boolean = false

  // this is arbitrary data that can be passed to this
  // component that will get passed to the experience
  @Input() private data: any

  // this is the DOM element that will get passed to the
  // experience as the container for all of it's work
  @ViewChild('outlet') private outlet!: ElementRef
  @ViewChild('original') private original!: ElementRef

  // the experience component API on window
  private component: any = null

  // the experience component instance
  private experience: any = null

  // when this component gets destroyed
  private destroyed: boolean = false

  constructor (
    // used to detect changes when the experience
    // code initiates state changes
    private changeDetector: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit () {
    if (isPlatformBrowser(this.platformId)) {
      log(`[qubit-angular/wrapper] [${this.id}] onOnInit`)
      if (this.disable) {
        log(`[qubit-angular/wrapper] [${this.id}] disabled`)
        return
      }
      this.registerWithExperiences()
    }
  }

  registerWithExperiences () {
    log(`[qubit-angular/wrapper] [${this.id}] registerWithExperiences`)
    this.component = createObjectPath(window, ['__qubit', 'angular', 'components', this.id])

    if (this.component.isControl) {
      log(`[qubit-angular/wrapper] [${this.id}] in control - not doing anything`)
      return
    }

    this.component.instances = this.component.instances || []
    this.component.instances.push(this)

    if (this.component.rendered) {
      this.takeOver()
    }
  }

  takeOver () {
    log(`[qubit-angular/wrapper] [${this.id}] takeOver`)
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
      logError(`Starting the experience in id=${this.id} failed`, err)
      this.release()
    }
  }

  release () {
    log(`[qubit-angular/wrapper] [${this.id}] release`)
    if (this.experience && this.experience.onDestroy) {
      try {
        this.experience.onDestroy()
      } catch (err) {
        logError(`The onDestroy hook of experience ${this.id} failed`, err)
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
      log(`[qubit-angular/wrapper] [${this.id}] has been disabled`)
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
    if (isPlatformBrowser(this.platformId)) {
      log(`[qubit-angular/wrapper] [${this.id}] ngOnDestroy`)
      this.destroyed = true
      this.component.instances = this.component.instances.filter((i: QubitAngularComponent) => i !== this)
      this.release()
    }
  }
}
