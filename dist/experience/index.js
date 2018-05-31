"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var createObjectPath_1 = require("../lib/createObjectPath");
var log_1 = require("../lib/log");
function experience(meta) {
    var isControl = meta.variationIsControl;
    var noop = function () { };
    return {
        register: function (id, ExperienceComponent, cb) {
            log_1.log("[qubit-angular/exp] [" + id + "] registering");
            var claimed = false;
            var component = createObjectPath_1.createObjectPath(window, ['__qubit', 'angular', 'components', id]);
            // the slot already claimed by another experience
            if (component.claimed) {
                return noop;
            }
            claimed = true;
            component.claimed = true;
            component.isControl = isControl;
            component.ExperienceComponent = ExperienceComponent;
            component.instances = component.instances || [];
            component.instances.forEach(function (i) {
                i.takeOver();
            });
            cb && cb();
            return function release() {
                if (claimed) {
                    claimed = false;
                    component.claimed = false;
                    delete component.ExperienceComponent;
                    component.instances.forEach(function (i) { return i.release(); });
                }
            };
        }
    };
}
exports.default = experience;
//# sourceMappingURL=index.js.map