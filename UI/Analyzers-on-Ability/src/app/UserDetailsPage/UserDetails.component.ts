import { environment } from './../../environments/environment';
import { Router } from '@angular/router';
import { Component, OnInit, ViewChild, ViewEncapsulation, ViewContainerRef } from '@angular/core';
import { UserdetailssvcService } from '../Services/userdetailssvc.service';
import { IUserAccessDetails } from '../Interfaces/IUserAccessDetails';
import {
  IgxGridComponent, IgxNumberSummaryOperand, IgxStringFilteringOperand,
  IgxSummaryResult, IgxDialogComponent, IgxGridRowComponent
} from 'igniteui-angular';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserDataProvider } from '../Provider/userDetail_Data.provider';
import { IUserDetails } from '../Interfaces/IUserDetails';
import { UserManagementSvcService } from '../Services/user-management-svc.service';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { validateBasis } from '@angular/flex-layout';
import { ToastrService } from 'ngx-toastr';
import { SessionStorageService } from '../Services/SessionStorageService';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { AppComponent } from '../app.component';

/**
 * @title Basic menu
 */
@Component({
  selector: 'UserDetails',
  templateUrl: 'UserDetails.component.html',
  styleUrls: ['./../HomePage/HomePage.component.css', 'UserDetails.component.css'],
})
export class UserDetails {

  public Title: string = environment.Title;
  @ViewChild('grid_UserAccessdetails', { read: IgxGridComponent })
  public grid_UserAccessdetails: IgxGridComponent;
  @ViewChild('dialogConfirm', { read: IgxDialogComponent })
  public dialog: IgxDialogComponent;
  public deleterow: IgxGridRowComponent;  
  public _UserAccessDetailsData: any = {};
  public _UserAccessDispSearch: IUserAccessDetails[] = [];
  public _UserAccessMasterData: IUserAccessDetails[] = [];
  public _routedUserDetail: IUserDetails = null;
  public txt_instDBGID: String = '';
  submitted = false;
  public LoggedInUser: IUserDetails;
  public showhide_password: boolean = false;
  public headerText: String = 'Basic information';
  updatePasswordForm: FormGroup;
  updateUserModal: any = {
    Email: String,
    Name: String,
    Password: String,
    UpdatedBy: String
  };

  constructor(private _UseraccessdetailsSvc: UserdetailssvcService, private ng4Spinner: Ng4LoadingSpinnerService,
    private updateformBuilder: FormBuilder, private _storageService: SessionStorageService,
    private toastr: ToastrService, private _userDataProvider: UserDataProvider,
    private _userManagementsvc: UserManagementSvcService, private router: Router, private appComponent: AppComponent) {
    if (this._storageService.Session_UserInfo) {
      if (this._storageService.Session_UserInfo.IsDefaultUser) {
        this.router.navigate(['/ResetPass']);
      }
      if (this._storageService.Session_UserInfo.IsAbbEmail) {
        this.router.navigate(['/Password']);
      }
    } else {
      this._storageService.clearSession();
     // this.router.navigate(['/Login']);
    }
    this.LoggedInUser = this._storageService.Session_UserInfo;
    appComponent.ngIdleImplementation();
  }

  ngOnInit(): void {

    this.registrationFormvalidators();
    this.getAllUserAccessdetails();
    this._routedUserDetail = this._userDataProvider.userDetails;
    this.headerText = 'Basic information';
  }
  ngOnDestroy() {
    this.appComponent.resetTimeOut();

  }
  public getAllUserAccessdetails() {

    this.ng4Spinner.show();
    this._UserAccessDispSearch = [];
    this._UserAccessMasterData = [];
    this._UseraccessdetailsSvc.getAssignedAbilityDBGUID
      (this._userDataProvider.userDetails.Email, this._storageService.Session_UserInfo.Email).subscribe(
        data => {
          data.forEach((element) => {
            this._UserAccessDetailsData.InstanceDBGUID = element;
            this._UserAccessDetailsData.UserEmailId = this._routedUserDetail.Email;
            this._UserAccessMasterData.push(this._UserAccessDetailsData);
            this._UserAccessDetailsData = {};
          });
          this._UserAccessDispSearch = this._UserAccessMasterData;
          this.ng4Spinner.hide();
        },
        error => {
          this.ng4Spinner.hide();
          console.log('UserEmailID: ' + this._storageService.Session_UserInfo.Email +
            ' CreatedBy: ' + this._storageService.Session_UserInfo.Email + ' Error: ' + error);
        }
      );
    // if (this._UserAccessDispSearch.length > 0) {
    //   this.grid_UserAccessdetails.paginate(0);
    // }
    // else {
    //   this.grid_UserAccessdetails.paging = false;
    // }

  }

  // this.grid_UserAccessdetails.paging = true;
  // this.grid_UserAccessdetails.paginate(0);

  get f() {
    return this.updatePasswordForm.controls;
  }

  // Intialize the Form validators for the Add user Form
  public registrationFormvalidators() {
    this.updatePasswordForm = this.updateformBuilder.group({
      Password: ['', [Validators.required, Validators.minLength(8),
      Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$')]],
      passwordConfirm: ['', [Validators.minLength(8)]]

    }, { validator: this.checkIfMatchingPasswords('Password', 'passwordConfirm') });
  }

  // Delete User Row with Confirmation
  public deleteUserRow(deleteUserRow: any) {
    this.deleterow = deleteUserRow;
    this.dialog.open();
  }

  checkIfMatchingPasswords(passwordKey: string, passwordConfirmationKey: string) {
    return (group: FormGroup) => {
      const passwordInput = group.controls['Password'];
      const passwordConfirmationInput = group.controls['passwordConfirm'];
      if (passwordInput.value !== passwordConfirmationInput.value) {
        return passwordConfirmationInput.setErrors({ notEquivalent: true });
      } else {
        return passwordConfirmationInput.setErrors(null);
      }
    };
  }

  // grid delete after confirmation
  public deleteRow() {
    this.ng4Spinner.show();
    this._UserAccessDetailsData = {};
    const rowIndex: number = this.deleterow['rowIndex'];
    this._UserAccessDetailsData.UserEmailId = this.deleterow.rowID.UserEmailId;
    this._UserAccessDetailsData.InstanceDBGUID = this.deleterow.rowID.InstanceDBGUID;
    this._UserAccessDetailsData.UpdatedBy = this._storageService.Session_UserInfo.Email;

    this._UseraccessdetailsSvc.deleteAssignedAbilityDBGUID(this._UserAccessDetailsData).subscribe(
      (data: Response) => {
        // console.log(data);

        const row = this.grid_UserAccessdetails.getRowByIndex(rowIndex);
        row.delete();
        this.dialog.close();
        this.ng4Spinner.hide();
        this.toastr.success('Instance has been deleted.', 'SUCCESS', {
          timeOut: 5000,
        });

      });
  }

  private AddInstDBGuid() {
    this.ng4Spinner.show();
    if (this.txt_instDBGID !== '') {
      this._UserAccessDetailsData = {};
     
      this._UserAccessDetailsData.UserEmailId = this._userDataProvider.userDetails.Email;
      // this._UserAccessDetailsData.InstanceDBGUID = 'NX01_' + this.txt_instDBGID.trim();
      this._UserAccessDetailsData.InstanceDBGUID = 'NX01_' + this.txt_instDBGID.replace(/\s/g, "");
      this._UserAccessDetailsData.CreatedBy = this._storageService.Session_UserInfo.Email;
      this._UseraccessdetailsSvc.postAssignedAbilityDBGUID(this._UserAccessDetailsData).subscribe(
        (data: Response) => {
          this.ng4Spinner.hide();
          this.getAllUserAccessdetails();
          if (this._userDataProvider.userDetails.Email !== this._storageService.Session_UserInfo.Email ) {
            //  this.AddDBGuidtoSuperuser();
            
          }
          this.txt_instDBGID = '';
          this.toastr.success('Instance has been created.', 'SUCCESS', {
            timeOut: 5000,
          });
        },
        error => {
          this.toastr.error('The instance number is incorrect, please try again.', 'ERROR', {
            timeOut: 5000,
          });
          this.ng4Spinner.hide();
        }
      );

    } else {
      this.ng4Spinner.hide();
    }

  }
  trim (el) {
    el.value = el.value.
       replace (/(^\s*)|(\s*$)/gi, "");
       return;
  }

  // private AddDBGuidtoSuperuser() {

  //   this._UserAccessDetailsData = {};

  //   this._UserAccessDetailsData.UserEmailId = this._storageService.Session_UserInfo.Email;
  //   this._UserAccessDetailsData.InstanceDBGUID = 'NX01_' + this.txt_instDBGID.trim();
  //   this._UserAccessDetailsData.CreatedBy = this._storageService.Session_UserInfo.Email;
  //   this._UseraccessdetailsSvc.postAssignedAbilityDBGUID(this._UserAccessDetailsData).subscribe(
  //     (data: Response) => {
  //       // this.ng4Spinner.hide();
  //       // this.getAllUserAccessdetails();
  //       // this.toastr.success('Device mapped to the user Successfully!', 'SUCCESS', {
  //       //   timeOut: 5000,
  //       // });
  //     }
  //     //,
  //     // error => {
  //     //   this.toastr.error('Device mapping to the user failed!', 'ERROR', {
  //     //     timeOut: 5000,
  //     //   });
  //     //   this.ng4Spinner.hide();
  //     // }
  //   );
  // }
 
  private hideshowpassword() {
    this.router.navigate(['/ResetPass']);
     this.headerText = '';
     this.showhide_password = true;
    this.headerText = 'Changing password';
   }

  private Clearpassword() {
    this.showhide_password = false;
    this.headerText = 'Basic information';
    this.updatePasswordForm.markAsUntouched();
    this.updatePasswordForm.markAsPristine();
  }



  onSubmit() {
    // stop here if form is invalid
    this.ng4Spinner.show();
    this.submitted = true;
    if (this.updatePasswordForm.invalid) {
      this.ng4Spinner.hide();
      return;
    }
    this.updateUserModal.Email = this._routedUserDetail.Email;
    this.updateUserModal.Name = this._routedUserDetail.Name;
    this.updateUserModal.UpdatedBy = '2'; // Wrong hard coded for now to post the data;
    this.updateUserModal.Password = this.updatePasswordForm.value.Password;
   // console.log(this.updateUserModal);
    this._userManagementsvc.putUpdateUserDetail(this.updateUserModal).subscribe(
      data => {
       // console.log(data);
        if (data.toString() === 'UserUpdated') {
          this.ng4Spinner.hide();
          this.Clearpassword();
          this.toastr.success('Password has been updated.', 'SUCCESS', {
            timeOut: 5000,
          });
        } else if (data === 'AvailableInLastThreePasswords') {
          this.ng4Spinner.hide();
          this.toastr.error('Password should be different from last three passwords.', 'ERROR', {
            timeOut: 5000,
          });
        } else {
          this.ng4Spinner.hide();
          this.toastr.error('Something went wrong, please try updating password again.', 'ERROR', {
            timeOut: 5000,
          });
        }
      }
    );
  }

}
