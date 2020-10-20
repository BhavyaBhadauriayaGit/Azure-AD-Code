import { environment } from './../../environments/environment';
import { SessionStorageService } from './../Services/SessionStorageService';

  //import { GridComponent } from './../GridStructure/Grid.component';
import { Component, ViewChild } from '@angular/core';
import { HomeService } from './../Services/HomeService';
import { CloseScrollStrategy, ConnectedPositioningStrategy, HorizontalAlignment, IgxDropDownComponent, VerticalAlignment } from 'igniteui-angular';
import { IVerificationHistory } from './IVerificationHistory';
import { UserdetailssvcService } from '../Services/userdetailssvc.service';
import { IUserAccessDetails } from '../Interfaces/IUserAccessDetails';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import {
  IgxGridComponent, IgxNumberSummaryOperand, IgxStringFilteringOperand,
  IgxSummaryResult, IgxDialogComponent, IgxGridRowComponent
} from 'igniteui-angular';

import { AppComponent } from '../app.component';
import { isUndefined, isNullOrUndefined } from 'util';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'HomePage',
  templateUrl: './HomePage.component.html',
  styleUrls: ['./../MenuBar/Menu.component.css', './HomePage.component.css', './../Carousels/Carousels.component.css'],
  providers: [DatePipe]
})



export class HomeComponent {
  public title : string = environment.title;
  public IsPasswordExpired = false;
  public ToNotifyOnPasswordExpiration = false;
  public totalleftdays: number;

   // myDate = new Date();
   // today: number = Date.now();

  @ViewChild(IgxDropDownComponent) public igxDropDown: IgxDropDownComponent;
  @ViewChild('dialogConfirm', { read: IgxDialogComponent })
  public dialog: IgxDialogComponent;
  public _deviceInstanceList: any[] = [];
  public _UserAccessDetailsData: IUserAccessDetails[] = [];
  private _positionSettings = {
    horizontalStartPoint: HorizontalAlignment.Left,
    verticalStartPoint: VerticalAlignment.Bottom
  };
  private _overlaySettings = {
    closeOnOutsideClick: true,
    modal: false,
    positionStrategy: new ConnectedPositioningStrategy(this._positionSettings),
    scrollStrategy: new CloseScrollStrategy()
  };
   // public appComponent: AppComponent;
  constructor(private _HomeService: HomeService, private ng4Spinner: Ng4LoadingSpinnerService, private toastr: ToastrService,
    private _storageService: SessionStorageService, private router: Router, private datePipe: DatePipe, private appComponent: AppComponent) {
    appComponent.ngIdleImplementation();

  }

  public onDialogOKSelected(event) {
    event.dialog.close();
  }

  ngOnInit(): void {
    if (this._storageService.Session_UserInfo) {
      if (this._storageService.Session_UserInfo.IsAbbEmail) {
        this.router.navigate(['/Password']);
      } else if (this._storageService.Session_UserInfo.IsDefaultUser) {
        this.router.navigate(['/ResetPass']);
      } else { }
      if (this._storageService.Session_UserInfo.IsPasswordExpired) {
        this.toastr.error('Password is expired.', 'INFO', {
          timeOut: 5000,
        });
        this.router.navigate(['/ResetPass']);
      } else if (this._storageService.IsPExpirtyNotified === false && this._storageService.Session_UserInfo.ToNotifyOnPasswordExpiration === true) {
         //   alert('coming');
        this.todaydate();
        this._storageService.IsPExpirtyNotified = true;
      } else { }


    } else {
      this._storageService.clearSession();
    //  this.router.navigate(['/Login']);
    }
    if (this._storageService.Session_UserInfo) {
      const PasswordexpiryDate = this._storageService.Session_UserInfo.PasswordExpirationDate;
    }
    

    this.ng4Spinner.show();
    this.getAllInstance();
     // this.getAllUserAccessdetails();
    this.ng4Spinner.hide();
  }

  ngOnDestroy() {
    this.appComponent.resetTimeOut();
  }
  public todaydate() {
    const currentDate = new Date();
    const todayDate = currentDate;
   // console.log(todayDate);
    const Apidate = this._storageService.Session_UserInfo.PasswordExpirationDate.toString().split('T');

    const newApiDate = Apidate[0];
    const newlyApiDate = new Date(newApiDate);
   // console.log(newlyApiDate);
     // var formatDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
     // console.log(formatDate);
    const leftTime: any = Date.parse(newlyApiDate.toString()) - Date.parse(todayDate.toString());
    const leftdays = (leftTime / (60 * 60 * 24 * 1000));
    this.totalleftdays = Math.floor(leftdays);
    //console.log(this.totalleftdays);
    if (this.totalleftdays < 16) {
      this.dialog.open();
      this.dialog.message = 'Password will expire in  ' + ' ' + this.totalleftdays + ' ' + 'days';
    }
  }




  public toggleDropDown(eventArgs) {
    this._overlaySettings.positionStrategy.settings.target = eventArgs.target;
    this.igxDropDown.toggle(this._overlaySettings);
  }

  public getAllInstance() {
    this.ng4Spinner.show();
    this._HomeService.getAllInstance(this._storageService.Session_UserInfo.Email,
      this._storageService.Session_UserInfo.Email).subscribe(
        data => {

          this._deviceInstanceList = data as any[];
          this.ng4Spinner.hide();
        },
        error => {
          this.ng4Spinner.hide();
          console.log('UserEmailID: ' + this._storageService.Session_UserInfo.Email + ' CreatedBy: ' + this._storageService.Session_UserInfo.Email + ' Error: ' + error);
        }
      );
  }
}








