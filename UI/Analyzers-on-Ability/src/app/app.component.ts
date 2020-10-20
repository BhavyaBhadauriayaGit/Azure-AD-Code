import { Component, ElementRef } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap/modal/modal.module';
import { ProgressBarModalComponent } from './../app/progressBar.component';
import { EventTargetInterruptSource, Idle } from '@ng-idle/core';
import { SessionStorageService } from './Services/SessionStorageService';
import { Router } from '@angular/router';
import { BroadcastService, MsalService } from '@azure/msal-angular';
import { Logger, CryptoUtils } from 'msal';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {  OnInit } from '@angular/core';

/**
 * @title Basic menu
 */
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent implements OnInit {
  title = 'MSAL Angular - Sample App';
     isIframe = false;
  loggedIn = false;
  idleState = 'NOT_STARTED';
  timedOut = false;
  progressBarPopup: NgbModalRef;
  userCount: number;
  constructor(private http: HttpClient, private broadcastService: BroadcastService, private authService: MsalService, private element: ElementRef, private router: Router,  private idle: Idle,
     private ngbModal: NgbModal, private _storageService: SessionStorageService) {
    this.ngIdleImplementation();
  }
  ngOnInit() {
    this.isIframe = window !== window.parent && !window.opener;
console.log(!this.isIframe);
    this.checkAccount();

    this.broadcastService.subscribe('msal:loginSuccess', () => {
      this.checkAccount();
      this.router.navigate(['/home']);
    });

    this.authService.handleRedirectCallback((authError, response) => {
      if (authError) {
        console.error('Redirect Error: ', authError.errorMessage);
        return;
      }

      console.log('Redirect Success: ', response.accessToken);
      return localStorage.getItem(response.accessToken);
    });

    this.authService.setLogger(new Logger((logLevel, message, piiEnabled) => {
      console.log('MSAL Logging: ', message);
    }, {
      correlationId: CryptoUtils.createNewGuid(),
      piiLoggingEnabled: false
    }));
  }

  checkAccount() {
    this.loggedIn = !!this.authService.getAccount();
  }

  login() {
    const isIE = window.navigator.userAgent.indexOf('MSIE ') > -1 || window.navigator.userAgent.indexOf('Trident/') > -1;

    if (isIE) {
      this.authService.loginRedirect();
   
    } else {
      this.authService.loginPopup();
    }
  }

  logout() {
    this.authService.logout();
  }

  
  ngOnDestroy() {
    this.resetTimeOut();

  }

  reverseNumber(countdown: number) {
    return (300 - (countdown - 1));
  }

  reset() {
    this.idle.watch();
    this.idleState = 'Started.';
    this.timedOut = false;
  }

  openProgressForm(count: number) {
    this.progressBarPopup = this.ngbModal.open(ProgressBarModalComponent, {
      backdrop: 'static',
      keyboard: false
    });
    this.progressBarPopup.componentInstance.count = count;
    this.progressBarPopup.result.then((result: any) => {
      if (result !== '' && 'logout' === result) {
        this.logout();
      } else {
        this.reset();
      }
    });
  }

  // logout() {
  //   this.resetTimeOut();
    
  //   this._storageService.clearSession();
  //   this.router.navigateByUrl('~/login');
  //   this.preventBack();

  // }

   preventBack(){window.history.forward();
    setTimeout('preventBack()', 0);
    window.onunload=function(){null};
   }


  closeProgressForm() {
    // this.progressBarPopup.close();
    this.ngbModal.dismissAll();
  }

  resetTimeOut() {
    this.idle.stop();
    
     // this.idle.onIdleStart.unsubscribe();
     // this.idle.onTimeoutWarning.unsubscribe();
     // this.idle.onIdleEnd.unsubscribe();
     // this.idle.onIdleEnd.unsubscribe();
    this.idle.onTimeout.observers.length = 0;
    this.idle.onIdleStart.observers.length = 0;
    this.idle.onIdleEnd.observers.length = 0;
    


  }

  // resetTimeOutLogOut() {
  //   this.resetTimeOut();
  //   this.router.navigateByUrl('localhost:4200/login');


   // }


  ngIdleImplementation()
  {
    if(this.router.url !== '/login' && this.router.url !== '/')     
    this.idle.setIdle(1800);
      // sets a timeout period of 5 minutes.
    this.idle.setTimeout(30);

    this.idle.setInterrupts([
      new EventTargetInterruptSource(
        this.element.nativeElement, 'keydown DOMMouseScroll mousewheel mousedown touchstart touchmove scroll')]);


    this.idle.onIdleEnd.subscribe(() => {
      this.idleState = 'NO_LONGER_IDLE';
    });

    this.idle.onTimeout.subscribe(() => {
      this.idleState = 'TIMED_OUT';
      this.timedOut = true;
      this.closeProgressForm();
      this.logout();
    });

    this.idle.onIdleStart.subscribe(() => {
      this.idleState = 'IDLE_START', this.openProgressForm(1);
    });

    this.idle.onTimeoutWarning.subscribe((countdown: any) => {
      this.idleState = 'IDLE_TIME_IN_PROGRESS';
      this.progressBarPopup.componentInstance.count = (Math.floor((countdown - 1) / 60) + 1);
      this.progressBarPopup.componentInstance.progressCount = this.reverseNumber(countdown);
      this.progressBarPopup.componentInstance.countMinutes = (Math.floor(countdown / 60));
      this.progressBarPopup.componentInstance.countSeconds = countdown % 60;
    });


    this.reset();
  }
  }

