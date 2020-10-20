import { environment } from './../../environments/environment';
import { IUserDetails } from './../Interfaces/IUserDetails';
import { Component, HostBinding, ViewChild, ViewEncapsulation, ViewContainerRef, ElementRef } from '@angular/core';
import {
  CloseScrollStrategy,
  ConnectedPositioningStrategy,
  HorizontalAlignment,
  IgxButtonDirective,
  IgxToggleDirective,
  VerticalAlignment
} from 'igniteui-angular';
import { SessionStorageService } from '../Services/SessionStorageService';
import { Router } from '@angular/router';
import { PasswordSvc } from './../Services/PasswordSvc';

/**
 * @title Basic menu
 */
@Component({
  selector: 'MenuBar',
  templateUrl: 'Menu.component.html',
  styleUrls: ['Menu.component.css'],
})
export class MenuBar {
  public title:string = environment.title;
  public LoggedInUser: IUserDetails;
  @ViewChild(IgxToggleDirective) public igxToggle: IgxToggleDirective;
  @ViewChild('button') public igxButton: ElementRef;
  PasswordModal: any = {
    Email: String,
    IsLoggedIn: Boolean
  };

  public _positionSettings = {
    horizontalStartPoint: HorizontalAlignment.Left,
    verticalStartPoint: VerticalAlignment.Bottom
  };
  public _overlaySettings = {
    closeOnOutsideClick: true,
    modal: false,
    positionStrategy: new ConnectedPositioningStrategy(this._positionSettings),
    scrollStrategy: new CloseScrollStrategy()
  };
  public toggle() {
    this._overlaySettings.positionStrategy.settings.target = this.igxButton.nativeElement;
    this.igxToggle.toggle(this._overlaySettings);

  }


  constructor(private _storageService: SessionStorageService, private routes: Router, private _Logoutsvc: PasswordSvc) {
    if (this._storageService.Session_UserInfo) {
      this.LoggedInUser = this._storageService.Session_UserInfo;
    } else {
      this._storageService.clearSession();
    //  this.routes.navigate(['/Login']);
    }
    
  }


  logout() {
    this.PasswordModal.Email = this._storageService.Session_UserInfo.Email;
    this.PasswordModal.IsLoggedIn = false;
    this._Logoutsvc.putUpdatePassword(this.PasswordModal).subscribe(
      (data: Response) => {
       // console.log(data);
        this._storageService.clearSession();
        this.LoggedInUser = null;
        //this.routes.navigate(['/Login']);
      }, error => {
        console.log('Error: ' + error);
      }
    );
     this._storageService.clearSession();
  
   // this.routes.navigate(['/Login']);
  }

}
