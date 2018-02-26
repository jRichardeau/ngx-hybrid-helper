import {Directive, ElementRef, Inject, Injector} from '@angular/core';
import {UpgradeComponent} from "@angular/upgrade/static";

@Directive({
    selector: 'ngx-hybrid-helper-root'
})
export class NgxRootNodeDirective extends UpgradeComponent {
    constructor(@Inject(ElementRef) elementRef: ElementRef,@Inject(Injector) injector: Injector) {
        super('ng1HybridHelperRoot', elementRef, injector);
    }
}
