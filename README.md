# ngx-hybrid-helper

## Overview 

This package helps to bootstrap an AngularJS application with Angular 5, so that you can migrate easily.

This is certainly not the only way to run an hybrid application, but it worked for me for many applications.

There are few steps to follow, but it can save some of your time, that I've lost to find this configuration.

You should read the official angular documentation about how to upgrade AngularJS apps 
https://angular.io/guide/upgrade

## Prerequisites

   - Node v8+
   - npm v5+

## Steps

You have to do the following steps so that it can work.

### step-1 Install package

Install the `ngx-hybrid-helper` package :

`npm install ngx-hybrid-helper --save`

### step-2 Install Angular dependencies

Install the following Angular dependencies :

    "@angular/common": "~5.1.0"
    "@angular/compiler": "~5.1.0",
    "@angular/core": "~5.1.0",
    "@angular/platform-browser": "~5.1.0",
    "@angular/platform-browser-dynamic": "~5.1.0",
    "@angular/upgrade": "~5.1.0",
    "core-js": "~2.5.3",
    "rxjs": "~5.5.5",
    "zone.js": "^0.8.4"

`npm install @angular/common@~5.1.0 @angular/compiler@~5.1.0 @angular/core@~5.1.0 @angular/platform-browser@~5.1.0 @angular/platform-browser-dynamic@~5.1.0 @angular/upgrade@~5.1.0 core-js@~2.5.3 rxjs@~5.5.5 zone.js@^0.8.4 --save`

Install the following devDependencies :

    "typescript": "~2.4.2",
    "webpack-dev-server": "~2.9.5",
    "rimraf": "^2.5.4"

`npm install typescript@~2.4.2 webpack-dev-server@~2.9.5 rimraf@^2.5.4 --save-dev`

### step-3 Create TypeScript configuration file

At the root of your application, create a `tsconfig.json` file that contains :

```json
{
    "compilerOptions": {
        "baseUrl": ".",
        "target": "es5",
        "module": "commonjs",
        "moduleResolution": "node",
        "sourceMap": true,
        "emitDecoratorMetadata": true,
        "experimentalDecorators": true,
        "lib": [
            "es2017",
            "dom"
        ],
        "noImplicitAny": false,
        "suppressImplicitAnyIndexErrors": true,
        "paths": {
            "@angular/*": ["node_modules/@angular/*"],
            "rxjs/*": ["node_modules/rxjs/*"]
        }
    },
    "files": [
        "app/ngx"
    ],
    "include": [
        "typings/typings.d.ts"
    ]
}
```

### step-4 Create a `typings/typings.d.ts` file, usefull for TypeScript

The file should contain :

```typescript
 declare const angular: any;
 
 interface NodeRequireFunction {
     (id: string): any;
 }
 
 interface NodeRequire extends NodeRequireFunction {
     resolve(id: string): string;
 
     cache: any;
     extensions: any;
     main: NodeModule | undefined;
 }
 
 declare var require: NodeRequire;
 
 interface NodeModule {
     exports: any;
     require: NodeRequireFunction;
     id: string;
     filename: string;
     loaded: boolean;
     parent: NodeModule | null;
     children: NodeModule[];
 }
 
 declare var module: NodeModule;
 ```
### step-6 Create `WebPack` configuration file

At the root of the application, create a `webpack.config.js` file that should contains

```javascript
    const path = require('path');
    const webPackGenericConf = require("ngx-hybrid-helper/webpack/webpack.config");

    module.exports = env => {
        const webPackConfig = webPackGenericConf({
            env: env,
            //Path to your app
            app: path.resolve("./app"),
            //Path to the build app (for production)
            dist: path.resolve("./dist")
        });
        return webPackConfig;
    };
```

### step-6 Create an `ngx/imports.ts` file

This file will tell to TypeScript transpiler which files to import in the application.

Create this file in a `ngx` directory, it should contains :

```typescript
//polyfills for es5 browsers
import "ngx-hybrid-helper/src/polyfills";
//Import ng1 component
import "ngx-hybrid-helper/src/hybrid-helper.ng1-root.component";
//Import ng5 scripts
import "ngx-hybrid-helper/src/hybrid-helper.bootstrap";
```

### step-7 Replace start command line in `package.json`

```json
{
    "scripts": {
        "start": "node ./node_modules/webpack-dev-server/bin/webpack-dev-server --env.dev --progress --inline --port 8000"
    }
}
```

### step-8 Create a main AngularJS module

Create an AngularJS module that depends on `ngx-hybrid-helper` and on your main module

```javascript
    angular.module("ng1-app",
        [
            "here-your-main-app-module",
            "ngx-hybrid-helper"
        ]);
```

### step-9 Create a main AngularJS component

Create an AngularJS component named `ng1AppRoot` that will be your *root node*, it should contains your main component that was in your `index.html`

```javascript
angular.module("your-main-app-module")
    .component("ng1AppRoot", {
        template: '<my-previous-main-node></my-previous-main-node>',
    });
```

### step-10 `index.html`

#### Remove ng-app from `index.html`

You have to remove your `ng-app="your-main-app-module"` from your `index.html`, because from now, it is Angular 5 that will bootstrap your application.

#### Replace your main AngularJS node

```html
<!--Remove this node-->
<my-previous-main-node></my-previous-main-node>
<!--Add this one-->
<app-root></app-root>
```

### step-11 Run your application

Launch `npm start`, open your browser on `localhost:8000`, and your application should be running as before, but bootstraped by Angular 5. 


------
## Next steps to develop Angular modules

With previous steps, you have validated that your AngularJS application could be running with Angular 5, but if it's not working, don't pursue next steps.

### Create your own components

To add your own Angular code to your application, you have to bootstrap the application by your own in order to add your modules in the build process.

### step-1 Root module

In the `ngx` directory, create an `app.module.ts` file, it will be the main module of your application.

The file should contains 

```typescript
import {NgModule} from "@angular/core";
import {HybridHelperModule, HybridHelperRootComponent} from "ngx-hybrid-helper";
import {CommonModule} from "@angular/common";

@NgModule({
    imports: [
        HybridHelperModule,
        CommonModule],
    bootstrap: [HybridHelperRootComponent]
})
export class AppModule {
}
```

### step-2 bootstrap application

In the `ngx` directory, create an `app.bootstrap.ts` file, it will bootstrap your main `AppModule`

The file should contains

```typescript
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import {AppModule} from "./app.module";

platformBrowserDynamic().bootstrapModule(AppModule);
```

### step-3 Import bootstrap file

In the `ngx/imports.ts` file, change this :

```typescript
//Remove this line
import "ngx-hybrid-helper/src/hybrid-helper.bootstrap";
//Replace with this one
import "./app.boostrap";
```

### step-4 Run application

Launch `npm start`, open your browser on `localhost:8000`, and your application should be running as before, but bootstraped by your own Angular 5 module.

### step-5 Create your components

You can now create your components/services... and import them in the `app.module.ts` file 

### step-6 Webpack

Don't hesitate to copy `webpack.config.js` file in your application because you will certainly need to have your own build configuration.

