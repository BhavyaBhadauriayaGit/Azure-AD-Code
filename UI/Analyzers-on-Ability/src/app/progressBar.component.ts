import { Router } from '@angular/router';
// import {  } from '@ng-bootstrap/ng-bootstrap';
 //To be included in Main branch

import {Component, Input} from '@angular/core';
import {NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'session-modal-popup',
  template: `
    <div class="modal-header">
      <h4 class="modal-title">User Session</h4>
    </div>
    <div class="modal-body">
      Session will be expired in 
      {{(countMinutes !== 0 ? + countMinutes+' Minute'+(countMinutes > 1 ? 's ' : ' ') : '') + countSeconds+' Seconds'}}
      <p>
        <ngb-progressbar type="danger" [value]="Countprogress" [max]="300" animate="false"
                         class="progress-striped active">
        </ngb-progressbar>
      </p>
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-primary" (click)="continue()">Continue</button>
      <button type="button" class="btn btn-primary" (click)="logout()">Logout</button>
    </div>
  `
})
export class ProgressBarModalComponent {

public Countprogress : number;
  @Input() countMinutes: number;
  @Input() countSeconds: number;
  @Input() progressCount: number;

  constructor( public activeModal: NgbModal, private router:Router) {
  }
  continue() {
    this.activeModal.dismissAll(null);
  }
  logout() {
    this.activeModal.dismissAll('logout');
   // this.router.navigateByUrl('/login');
  }
}

