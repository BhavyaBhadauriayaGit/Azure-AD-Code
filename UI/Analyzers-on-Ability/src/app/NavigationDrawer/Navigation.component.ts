import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { IgxNavigationDrawerComponent } from 'igniteui-angular';
import { SessionStorageService } from '../Services/SessionStorageService';
import { IUserDetails } from '../Interfaces/IUserDetails';
import { Router } from '@angular/router';
import { UserDataProvider } from '../Provider/userDetail_Data.provider';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'NavdrawerComponent',
  styleUrls: ['Navigation.component.css'],
  templateUrl: 'Navigation.component.html'
})
export class NavdrawerComponent {

  public loggedinUser: IUserDetails;
  public showhide: boolean = false;

  constructor(private _storageService: SessionStorageService, private _routes: Router, private _userDataprovider: UserDataProvider) {
    this.showhide = true;
    if (this._storageService.Session_UserInfo) {
      this.loggedinUser = this._storageService.Session_UserInfo;
    } else {
      this._storageService.clearSession();
    //  this._routes.navigate(['/Login']);
    }
  }

  showAccessDetails(loggedinUser) {
    if (this._storageService.Session_UserInfo) {
      this._userDataprovider.userDetails = this._storageService.Session_UserInfo;
      this._routes.navigate(['/UserAccessDetails']);
    }
  }
}
