// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  title:'condition monitoring',
  Title:'Condition monitoring',
  TabTitle: 'ABB Ability condition monitoring for measurement devices',
 // baseUrl:'http://localhost:58980/',  
  scopeUri: ['api://cc1f9793-3910-4118-9385-9db53f2166cd/access_as_user'],  
  tenantId: 'b759a000-2d88-41f3-8342-da932d621ed5',  
  clientId: 'cc1f9793-3910-4118-9385-9db53f2166cd', 
  authority :'https://login.microsoftonline.com/b759a000-2d88-41f3-8342-da932d621ed5',
  redirectUrl: 'http://localhost:4200'  

};

/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
