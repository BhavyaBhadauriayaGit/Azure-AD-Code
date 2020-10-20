import { InputRestrictionDirective } from './SchedulerPage/ValidationDirective';
import { from } from 'rxjs';

// import { IgxLinearGraphRangeComponent } from 'igniteui-angular-gauges/ES5/igx-linear-graph-range-component';

// To be included in Main branch

import { DoughnutChartDemoComponent } from './Charts/Chart.component';

import { SchedulerComponent } from './SchedulerPage/Schedule.component';
import { NavdrawerComponent } from './NavigationDrawer/Navigation.component';

import { CarouselComponent } from './Carousels/Carousels.component';
import { HomeComponent } from './HomePage/HomePage.component';
import { AppComponent } from './app.component';
import { IndividualDeviceComponent } from './IndividualDevicePage/IndividualDevice.component';

import { ToastrModule } from 'ngx-toastr';

import { GridComponent } from './GridStructure/Grid.component';
import { UserDetails } from './UserDetailsPage/UserDetails.component';
import { UserManagementComponent } from './UserManagement/UserManagement.component';
import { MenuBar } from './MenuBar/Menu.component';

import { ResetPasswordComponent } from './ResetPassword/ResetPass.component';
// import {TreeModule} from 'primeng/tree';


import { MsalModule, MsalInterceptor } from '@azure/msal-angular';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Injectable } from '@angular/core'; // CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

// Charts
import { ChartsModule } from 'ng2-charts/ng2-charts';

import { NgIdleKeepaliveModule } from '@ng-idle/keepalive';
import { StorageServiceModule } from 'angular-webstorage-service';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ProgressBarModalComponent } from './progressBar.component';

// Routing
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { AppMaterialModules } from './material.module';
import { FlexLayoutModule } from '@angular/flex-layout';
// import { LoginComponent } from './LoginPage/Login.component';
import { PasswordComponent } from './ChangeDefaultPassword/Password.component';



import { IgxLinearGaugeModule } from 'igniteui-angular-gauges/ES5/igx-linear-gauge-module';
import { IgxLinearGraphRangeModule } from 'igniteui-angular-gauges/ES5/igx-linear-graph-range-module';


import { IgxLegendModule } from 'igniteui-angular-charts/ES5/igx-legend-module';

import { SideNav } from './SideNav/SideNav.component';


// Service Import
import { HomeService } from './Services/HomeService';
import { IndividualDeviceSvc } from './Services/IndividualDeviceSvc';
import { UtilitySvc } from './Services/UtilitySvc';
import { SchedulerSvc } from './Services/SchedulerSvc';
import { UserManagementSvcService } from './Services/user-management-svc.service';
import { LoginServices } from './Services/LoginSvc';
import { UserdetailssvcService } from './Services/userdetailssvc.service';
//import { RadialServices } from './Services/RadialSvc';
import { MatNativeDateModule } from '@angular/material/core';




import { PasswordSvc } from './Services/PasswordSvc';

  // Data Providers
import { UserDataProvider } from './Provider/userDetail_Data.provider';

// Loader's
import { Ng4LoadingSpinnerModule, Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
// DataGrid
import {
  IgxButtonModule,
  IgxGridModule,
  IgxIconModule,
  IgxRippleModule,
  IgxDropDownModule,
  IgxNavigationDrawerModule,
  IgxToggleModule,
  IgxCalendarModule,
  IgxCarouselModule,
  IgxProgressBarModule,
  IgxSliderModule,
  IgxCheckboxModule,
  IgxDialogModule,
} from 'igniteui-angular';
// Pipe
import { Searchfilterpipe } from './SchedulerPage/SearchFilter.pipe';
import { SessionStorageService } from './Services/SessionStorageService';
import 'hammerjs';
import 'chartjs-plugin-zoom';
import { GlobalService } from './Services/global.service';
import { CsvDumpPageComponent } from './csv-dump-page/csv-dump-page.component';
import { CsvDumpService } from './Services/csv-dump.service';
import { MatPaginatorIntl } from '@angular/material';
import { CustomMatPaginatorIntl } from './csv-dump-page/custom-mat-paginator-int';
import { ProfileComponent } from './profile/profile.component';


const isIE = window.navigator.userAgent.indexOf('MSIE ') > -1 || window.navigator.userAgent.indexOf('Trident/') > -1;



@NgModule({
  declarations: [
    
    MenuBar,
   // LoginComponent,
    PasswordComponent,
    UserManagementComponent,
    UserDetails,
    GridComponent,
    CarouselComponent,
    HomeComponent,
    AppComponent,
    IndividualDeviceComponent,
    SchedulerComponent,
    DoughnutChartDemoComponent,
    NavdrawerComponent,
    ResetPasswordComponent,
    Searchfilterpipe,
    InputRestrictionDirective,
    ProfileComponent,
    //LineChartComponent,
    //TrendComponent,
    //RadialGaugeAnimationComponent,
    //KPINumberComponent,
    // KPI2DataComponent,
    //AlarmLogComponent,
    // MaintainanceLogComponent,
    //DiffVisual,
    SideNav,
    ProgressBarModalComponent,
    CsvDumpPageComponent


  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    HttpClientModule,
    RouterModule.forRoot([{ path: 'home', component: HomeComponent },
    { path: 'individualdevice', component: IndividualDeviceComponent },
    { path: 'scheduler', component: SchedulerComponent },
      { path: 'UserManagement', component: UserManagementComponent },
      { path: 'ExportData', component: CsvDumpPageComponent },
      { path: 'profile', component: ProfileComponent },
    // { path: 'Trend', component: TrendComponent },
   //  { path: 'Login', component: LoginComponent },
    { path: 'UserAccessDetails', component: UserDetails },
    { path: 'Password', component: PasswordComponent },
    { path: 'ResetPass', component: ResetPasswordComponent },
    // { path: '', redirectTo: 'Login', pathMatch: 'full' },
    // { path: '**', redirectTo: 'Login' }
    ]
      // {
      //   onSameUrlNavigation: 'reload',
      //   useHash: true
      // },
    ),

    IgxGridModule.forRoot(),
    IgxButtonModule,
    IgxIconModule,
    IgxRippleModule,
    IgxCheckboxModule,
    IgxDropDownModule,
    ChartsModule,
     // BaseChartDirective,
      // Color,
     // Label,
    IgxCarouselModule,
    IgxProgressBarModule,
    IgxSliderModule,
    IgxNavigationDrawerModule,
    IgxToggleModule,
    IgxCalendarModule,
    IgxDialogModule,
    // IgxRadialGaugeModule,    
    // IgxLegendModule,  

    //  IgxLinearGaugeModule,
    //  IgxLinearGraphRangeModule,
    // IgxLinearGraphRangeComponent,
    // TreeModule,

    MatNativeDateModule,
    



    // Material Modules
    AppMaterialModules,
    FlexLayoutModule,
    ToastrModule.forRoot(),

    StorageServiceModule,
    NgIdleKeepaliveModule.forRoot(),
    NgbModule.forRoot(),
    Ng4LoadingSpinnerModule.forRoot(),
    MsalModule.forRoot({
      auth: {
        clientId: 'cc1f9793-3910-4118-9385-9db53f2166cd',
        authority: 'https://login.microsoftonline.com/b759a000-2d88-41f3-8342-da932d621ed5',
        redirectUri: 'http://localhost:4200/',
      },
      cache: {
        cacheLocation: 'localStorage',
        storeAuthStateInCookie: isIE, // set to true for IE 11
      },
    },
    {
      popUp: !isIE,
      consentScopes: [
        'user.read',
        'openid',
        'profile',
        
      ],
      unprotectedResources: [],
      protectedResourceMap: [
      
        ['https://graph.microsoft.com/v1.0/me', ['user.read']]
      ],
      extraQueryParameters: {}
    })
  ],
   entryComponents: [SchedulerComponent, ProgressBarModalComponent],


  providers: [
    HomeService,
    CsvDumpService,
    IndividualDeviceSvc,
    UtilitySvc,
    SchedulerSvc,
    UserManagementSvcService,
    LoginServices,
    UserdetailssvcService,
    UserDataProvider,
    LoginServices,
    PasswordSvc,
    SessionStorageService,
    
    //  RadialServices,
    GlobalService,
    {
      // provide: MatPaginatorIntl,
      // useClass: CustomMatPaginatorIntl,
      provide: HTTP_INTERCEPTORS,
      useClass: MsalInterceptor,
      multi: true
    }
    
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
})
export class AppModule {
}


