"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@angular/core");
const createObjectPath_1 = require("../lib/createObjectPath");
const log_1 = require("../lib/log");
let QubitAngularComponent = class QubitAngularComponent {
    constructor(
    // used to detect changes when the experience
    // code initiates state changes
    changeDetector) {
        this.changeDetector = changeDetector;
        // toggles when the experience takes over
        this.isExperienceActive = false;
        // private window: Window
        // the experience component API on window
        this.component = null;
        // the experience component instance
        this.experience = null;
        // private changeDetector: ChangeDetectorRef
        // when this component gets destroyed
        this.destroyed = false;
    }
    ngOnInit() {
        log_1.log(`[qubit-angular/wrp] [${this.id}] onOnInit`);
        if (this.disable) {
            log_1.log(`[qubit-angular/wrp] [${this.id}] disabled`);
            return;
        }
        this.registerWithExperiences();
    }
    registerWithExperiences() {
        log_1.log(`[qubit-angular/wrp] [${this.id}] registerWithExperiences`);
        this.component = createObjectPath_1.createObjectPath(window, ['__qubit', 'angular', 'components', this.id]);
        if (this.component.isControl) {
            log_1.log(`[qubit-angular/wrp] [${this.id}] in control - not doing anything`);
            return;
        }
        this.component.instances = this.component.instances || [];
        this.component.instances.push(this);
        if (this.component.claimed) {
            this.takeOver();
        }
    }
    takeOver() {
        log_1.log(`[qubit-angular/wrp] [${this.id}] takeOver`);
        this.isExperienceActive = true;
        this.changeDetector.detectChanges();
        try {
            this.experience = new this.component.ExperienceComponent(this.outlet.nativeElement, this.original.nativeElement, this.data);
            this.experience.render();
        }
        catch (err) {
            if (window.console) {
                window.console.error(`Starting the experience in id=${this.id} failed`, err);
            }
            this.release();
        }
    }
    release() {
        log_1.log(`[qubit-angular/wrp] [${this.id}] release`);
        if (this.experience && this.experience.onDestroy) {
            try {
                this.experience.onDestroy();
            }
            catch (err) {
                if (window.console) {
                    window.console.error(`The onDestroy hook of experience ${this.id} failed`, err);
                }
            }
        }
        this.experience = null;
        this.isExperienceActive = false;
        if (!this.destroyed) {
            this.changeDetector.detectChanges();
        }
    }
    ngOnChanges() {
        if (this.disable && this.experience) {
            log_1.log(`[qubit-angular/wrp] [${this.id}] has been disabled`);
            this.release();
        }
        if (this.experience && this.experience.onChanges) {
            this.experience.onChanges(this.data);
        }
    }
    ngDoCheck() {
        if (this.experience && this.experience.doCheck) {
            this.experience.doCheck(this.data);
        }
    }
    ngOnDestroy() {
        log_1.log(`[qubit-angular/wrp] [${this.id}] ngOnDestroy`);
        this.destroyed = true;
        this.component.instances = this.component.instances.filter(i => i !== this);
        this.release();
    }
};
__decorate([
    core_1.Input()
], QubitAngularComponent.prototype, "id", void 0);
__decorate([
    core_1.Input()
], QubitAngularComponent.prototype, "disable", void 0);
__decorate([
    core_1.Input()
], QubitAngularComponent.prototype, "data", void 0);
__decorate([
    core_1.ViewChild('outlet')
], QubitAngularComponent.prototype, "outlet", void 0);
__decorate([
    core_1.ViewChild('original')
], QubitAngularComponent.prototype, "original", void 0);
QubitAngularComponent = __decorate([
    core_1.Component({
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
], QubitAngularComponent);
exports.QubitAngularComponent = QubitAngularComponent;
