"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var createObjectPath_1 = require("../lib/createObjectPath");
var log_1 = require("../lib/log");
var QubitAngularComponent = /** @class */ (function () {
    function QubitAngularComponent(
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
    QubitAngularComponent.prototype.ngOnInit = function () {
        log_1.log("[qubit-angular/wrp] [" + this.id + "] onOnInit");
        if (this.disable) {
            log_1.log("[qubit-angular/wrp] [" + this.id + "] disabled");
            return;
        }
        this.registerWithExperiences();
    };
    QubitAngularComponent.prototype.registerWithExperiences = function () {
        log_1.log("[qubit-angular/wrp] [" + this.id + "] registerWithExperiences");
        this.component = createObjectPath_1.createObjectPath(window, ['__qubit', 'angular', 'components', this.id]);
        if (this.component.isControl) {
            log_1.log("[qubit-angular/wrp] [" + this.id + "] in control - not doing anything");
            return;
        }
        this.component.instances = this.component.instances || [];
        this.component.instances.push(this);
        if (this.component.claimed) {
            this.takeOver();
        }
    };
    QubitAngularComponent.prototype.takeOver = function () {
        log_1.log("[qubit-angular/wrp] [" + this.id + "] takeOver");
        this.isExperienceActive = true;
        this.changeDetector.detectChanges();
        try {
            this.experience = new this.component.ExperienceComponent(this.outlet.nativeElement, this.original.nativeElement, this.data);
            this.experience.render();
        }
        catch (err) {
            if (window.console) {
                window.console.error("Starting the experience in id=" + this.id + " failed", err);
            }
            this.release();
        }
    };
    QubitAngularComponent.prototype.release = function () {
        log_1.log("[qubit-angular/wrp] [" + this.id + "] release");
        if (this.experience && this.experience.onDestroy) {
            try {
                this.experience.onDestroy();
            }
            catch (err) {
                if (window.console) {
                    window.console.error("The onDestroy hook of experience " + this.id + " failed", err);
                }
            }
        }
        this.experience = null;
        this.isExperienceActive = false;
        if (!this.destroyed) {
            this.changeDetector.detectChanges();
        }
    };
    QubitAngularComponent.prototype.ngOnChanges = function () {
        if (this.disable && this.experience) {
            log_1.log("[qubit-angular/wrp] [" + this.id + "] has been disabled");
            this.release();
        }
        if (this.experience && this.experience.onChanges) {
            this.experience.onChanges(this.data);
        }
    };
    QubitAngularComponent.prototype.ngDoCheck = function () {
        if (this.experience && this.experience.doCheck) {
            this.experience.doCheck(this.data);
        }
    };
    QubitAngularComponent.prototype.ngOnDestroy = function () {
        var _this = this;
        log_1.log("[qubit-angular/wrp] [" + this.id + "] ngOnDestroy");
        this.destroyed = true;
        this.component.instances = this.component.instances.filter(function (i) { return i !== _this; });
        this.release();
    };
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], QubitAngularComponent.prototype, "id", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], QubitAngularComponent.prototype, "disable", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], QubitAngularComponent.prototype, "data", void 0);
    __decorate([
        core_1.ViewChild('outlet'),
        __metadata("design:type", core_1.ElementRef)
    ], QubitAngularComponent.prototype, "outlet", void 0);
    __decorate([
        core_1.ViewChild('original'),
        __metadata("design:type", core_1.ElementRef
        // private window: Window
        // the experience component API on window
        )
    ], QubitAngularComponent.prototype, "original", void 0);
    QubitAngularComponent = __decorate([
        core_1.Component({
            selector: 'qubit-angular',
            template: "\n    <div #original [hidden]=\"isExperienceActive\">\n      <ng-content></ng-content>\n    </div>\n    <div *ngIf=\"isExperienceActive\">\n      <div #outlet></div>\n    </div>\n  "
        }),
        __metadata("design:paramtypes", [core_1.ChangeDetectorRef])
    ], QubitAngularComponent);
    return QubitAngularComponent;
}());
exports.QubitAngularComponent = QubitAngularComponent;
//# sourceMappingURL=qubit-angular.component.js.map