import {Provider} from "@angular/core";

export function getCompatibilityProviders(): Array<Provider> {
    return [
        {
            provide: '$scope',
            useFactory(injector: any) {
                return injector.get("$rootScope");
            },
            deps: ['$injector']
        }
    ];
}

