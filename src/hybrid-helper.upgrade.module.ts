import {NgModule} from '@angular/core';
import {HybridHelperRootComponent} from './hybrid-helper.root.component';
import {NgxRootNodeDirective} from './hybrid-helper.ngx-root'
import {getCompatibilityProviders} from './hybrid-helper.compatibilityProviders'

@NgModule({
    imports: [],
    declarations: [HybridHelperRootComponent, NgxRootNodeDirective],
    providers: getCompatibilityProviders()
})
export class HybridHelperUpgradeModule {}
