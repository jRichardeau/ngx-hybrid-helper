import {Inject, NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {UpgradeModule} from '@angular/upgrade/static';
import {HybridHelperUpgradeModule} from './hybrid-helper.upgrade.module';
import {HybridHelperRootComponent} from './hybrid-helper.root.component';

@NgModule({
    imports: [
        BrowserModule,
        UpgradeModule,
        HybridHelperUpgradeModule
    ],
    declarations: [],
    entryComponents: [],
    providers: [],
    bootstrap: [HybridHelperRootComponent]
})

export class HybridHelperModule {
    constructor(@Inject(UpgradeModule) private upgrade: UpgradeModule) {
        upgrade.bootstrap(document.body, ["ng1-app"], {strictDi: false});
    }
}
export * from './hybrid-helper.root.component';
