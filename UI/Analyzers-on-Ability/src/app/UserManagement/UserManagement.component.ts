
import { IUserAccessDetails } from './../Interfaces/IUserAccessDetails';
import { Component, OnInit, ViewChild, ViewEncapsulation, ViewContainerRef } from '@angular/core';
import { UserManagementSvcService } from '../Services/user-management-svc.service';
import { IUserDetails } from '../Interfaces/IUserDetails';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { validateBasis } from '@angular/flex-layout';
import {
  IgxGridComponent, IgxNumberSummaryOperand, IgxStringFilteringOperand,
  IgxSummaryResult, IgxDialogComponent, IgxGridRowComponent,SortingDirection
} from 'igniteui-angular';

import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { UserDataProvider } from '../Provider/userDetail_Data.provider';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { SessionStorageService } from '../Services/SessionStorageService';
import { AppComponent } from '../app.component';
/**
 * @title Basic menu
 */

// enum TYPE{
//   SINGLE="single",
//   MULTI="multiple"
// }


@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'UserManagementComponent',
  templateUrl: 'UserManagement.component.html',
  styleUrls: ['./../MenuBar/Menu.component.css', './../HomePage/HomePage.component.css', 'UserManagement.component.css'],
})
export class UserManagementComponent implements OnInit {
  @ViewChild('grid_Userdetails', { read: IgxGridComponent })
  public grid_Userdetails: IgxGridComponent;
  @ViewChild('dialogConfirm', { read: IgxDialogComponent })
  // public sortingTypes =  { name: "Single Sort", value: TYPE.SINGLE };
  // public currentSortingType: TYPE = TYPE.MULTI;
  public dialog: IgxDialogComponent;
  public deleterow: IgxGridRowComponent;
  public btnLabelUpdate: String = 'Add User';
  public _userdetails: IUserDetails[] = [];
  public _adduserinfo: IUserDetails[] = [];
  public _updateUserinfo: IUserDetails = null;
  public userheadertext: String = 'New user';
  public _default_role: Boolean = true;
  registerForm: FormGroup;
  submitted = false;
  addUserModal: any = {
    CreatedBy: Number,
    Email: String,
    IsDefaultUser: Boolean,
    Name: String,
    Password: String,
    RoleId: Number,
    RoleName: String
  };
  editUserModal: any = {
    UpdatedBy: String,
    Email: String,
    Name: String,
    Password: String,
    IsDefaultUser: Boolean
  };

  constructor(private _UserManagementService: UserManagementSvcService, private ng4Spinner: Ng4LoadingSpinnerService,
    private formBuilder: FormBuilder, private toastr: ToastrService, private _storageService: SessionStorageService,
    private routes: Router, private _userDataProvider: UserDataProvider, private appComponent: AppComponent) {
    if (this._storageService.Session_UserInfo) {
      if (this._storageService.Session_UserInfo.IsDefaultUser) {
        this.routes.navigate(['/ResetPass']);
      }
      if (this._storageService.Session_UserInfo.IsAbbEmail) {
        this.routes.navigate(['/Password']);
      }
    } else {
      this._storageService.clearSession();
      //this.routes.navigate(['/Login']);
    }

    this._default_role = true;
    appComponent.ngIdleImplementation();
  }

//   public removeSorting($event) {
//     if (this.currentSortingType === TYPE.MULTI) {
//         this.grid_Userdetails.columns.forEach((col) => {
//             if (!(col.field === $event.fieldName)) {
//                 this.grid_Userdetails.clearSort(col.field);
//             }
//         });
//     }
// }
 

  // Onintialization Method
  ngOnInit(): void {
     
   
      // this.grid_Userdetails.sortingExpressions = [
      //   {
      //     dir: SortingDirection.Desc, fieldName: "Email",
      //     ignoreCase: true
      //   }
      //   // { fieldName: 'Time', dir: SortingDirection.Desc }
      //   // { fieldName: 'Time', dir: SortingDirection.Desc }
      // ];
    this.ng4Spinner.show();
    this.registrationFormvalidators();
    this.getallUserDetails();
    this.ng4Spinner.hide();
    if (this.registerForm) {
      this.registerForm.controls.RoleName.setValue('2');
    }
  }
  ngOnDestroy() {
    this.appComponent.resetTimeOut();

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

  // Intialize the Form validators for the Add user Form
  public registrationFormvalidators() {
    const passwordvaildation = '^(?=.*[a-z])(?!.*\\s)(?!.*[\`\~$^\\[\\](){}\\|\'\,\.\:\;<>\\-\\_^])(?=.*[A-Z])(?!.*\\s)(?!.*[\`\~$^\\[\\](){}\\|\'\,\.\:\;<>\\-\\_^])(?=.*[0-9])(?!.*\\s)(?!.*[\`\~$^\\[\\](){}\\|\'\,\.\:\;<>\\-\\_^])(?=.*[\"\/!@#%*\?\=])(?!.*\\s)(?!.*[\`\~$^\\[\\](){}\\|\'\,\.\:\;<>\\-\\_^]).{7,}$';
    //const passwordvaildation = '^(?=.*[a-z])(?!.*\\s)(?!.*[\`\~$^\\[\\](){}\\|\'\,\.\:\;<>\\-\\_^])(?=.*[A-Z])(?!.*\\s)(?!.*[\`\~$^\\[\\](){}\\|\'\,\.\:\;<>\\-\\_^])(?=.*[0-9])(?!.*\\s)(?!.*[\`\~$^\\[\\](){}\\|\'\,\.\:\;<>\\-\\_^])(?=.*[\"\/!@#%&*\?\+=])(?!.*\\s)(?!.*[\`\~$^\\[\\](){}\\|\'\,\.\:\;<>\\-\\_^]).{7,}$'; // commented for a bug id 41532
    this.registerForm = this.formBuilder.group({
      Name: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(150),
      Validators.pattern('^[a-zA-Z][a-zA-Z ][a-zA-Z0-9 _\-]*$')]],
      Email: ['', [Validators.required, Validators.email,Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[^a-z][a-zA-Z0-9]+.[a-zA-Z]+$')]],
      Password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(12),
      Validators.pattern(passwordvaildation)]],
      passwordConfirm: ['', [Validators.minLength(8)]],
      RoleName: ['', Validators.required]
    }, { validator: this.checkIfMatchingPasswords('Password', 'passwordConfirm') });
  }

  // getting all the user details
  public getallUserDetails() {
    this.ng4Spinner.show();
    this._adduserinfo = null;
    this._UserManagementService.getAllUserDetails()
      .subscribe(data => {
        this._userdetails = data as IUserDetails[];
        //console.log(this._userdetails);
        const loggedinSuperUser: number = this._userdetails.findIndex(x => x.Email === this._storageService.Session_UserInfo.Email);
        //console.log(loggedinSuperUser);
        if (loggedinSuperUser !== -1) {
          this._userdetails.splice(loggedinSuperUser, 1);
        }
        this._adduserinfo = this._userdetails;
       // console.log(this._adduserinfo);
        this.ng4Spinner.hide();
      },
        error => {
          console.log('Error: ' + error);
          this.ng4Spinner.hide();
        }
      );
  }

  // loadspinner() {
  //   this.ng4Spinner.show();
  // }

  get f() { return this.registerForm.controls; }

  onSubmit() {
    this.ng4Spinner.show();
    this.submitted = true;
    // stop here if form is invalid
    if (this.registerForm.invalid) {
      this.ng4Spinner.hide();
      return;
    }
    if (this.btnLabelUpdate === 'Add User') {
      this.ng4Spinner.show();

      this.addUserModal.Email = this.registerForm.value.Email;
      this.addUserModal.Name = this.registerForm.value.Name;
      this.addUserModal.RoleId = this.registerForm.value.RoleName;
      this.addUserModal.RoleName = this.registerForm.value.RoleName === 1 ? 'Super User' : 'Operator';
      this.addUserModal.CreatedBy = '1'; // Wrong hard coded for now to post the data;
      this.addUserModal.IsDefaultUser = true;
      this.addUserModal.Password = this.registerForm.value.Password;
      //console.log(this.addUserModal.Password);
      this._UserManagementService.postAddUserDetail(this.addUserModal).subscribe(
        (data: Response) => {

          if (data.toString() === 'UserCreated') {
            this.ng4Spinner.hide();
            this.toastr.success('New user has been added.', 'SUCCESS', {
              timeOut: 5000,
            });
            this.getallUserDetails();
            this.ClearUserDetails();
          } else if (data.toString() === 'DuplicateEmail') {
            this.toastr.error('E-mail already exists, please try another one.', 'ERROR', {
              timeOut: 5000,
            });
            this.registerForm.controls.Email.setErrors({ invalid: true });
            this.registerForm.controls.Email.markAsDirty();
            this.ng4Spinner.hide();
          } else {
            this.toastr.error('Something went wrong, please try adding again.', 'ERROR', {
              timeOut: 5000,
            });
           // console.log('Error While adding the User');
            this.ng4Spinner.hide();
          }
        }
      );

    } else {
      this.ng4Spinner.show();
      this.editUserModal.Email = this._updateUserinfo.Email;
      this.editUserModal.Name = this.registerForm.value.Name;
      this.editUserModal.UpdatedBy = '2'; // Wrong hard coded for now to post the data;
      this.editUserModal.Password = this.registerForm.value.Password;
     // console.log(this.editUserModal.Password);
      this.editUserModal.IsDefaultUser = true;
      //console.log(this.editUserModal);
      this._UserManagementService.putUpdateUserDetail(this.editUserModal).subscribe(
        data => {
         // console.log(data);
          if (data.toString() === 'UserUpdated') {
            this.getallUserDetails();
            this.ClearUserDetails();
            this.btnLabelUpdate = 'Add User';
            this.toastr.success('User information has been updated.', 'SUCCESS', {
              timeOut: 5000,
            });
            this.ng4Spinner.hide();
          } else if (data === 'AvailableInLastThreePasswords') {
            this.toastr.error('Password should be different from last three passwords.', 'ERROR', {
              timeOut: 5000,
            });
            this.ng4Spinner.hide();
          } else {
            this.toastr.error('Something went wrong, please try updating again.', 'ERROR', {
              timeOut: 5000,
            });
            this.ng4Spinner.hide();
          }
        }
      );
    }
  }

  // Load the Clicked userinformation in the form for editing
  public editUserRow(editUserRow: any) {
    this._updateUserinfo = null;
    this.userheadertext = 'Edit information';
    this.btnLabelUpdate = 'Update User';
    this.registerForm.controls.Email.setValue(editUserRow.Email);
    this.registerForm.controls.Name.setValue(editUserRow.Name);
     this.registerForm.controls.passwordConfirm.reset();
    this.registerForm.controls.Password.reset();
    this._updateUserinfo = editUserRow;
    this.registerForm.controls.Password.markAsTouched();
    this.registerForm.controls.Email.disable();
    this.registerForm.controls.RoleName.disable();
  }

  // Delete User Row with Confirmation
  public deleteUserRow(deleteUserRow: any) {
    this.deleterow = deleteUserRow;
    this.dialog.open();
  }

  // grid delete after confirmation
  public deleteRow() {
    this.ng4Spinner.show();
    this._updateUserinfo = null;
    const rowIndex: number = this.deleterow['rowIndex'];
    const deleteEmailId = this.deleterow.rowID.Email;
    this._UserManagementService.deleteUserDetail(deleteEmailId).subscribe(
      data => {
        if (data === 'UserDeleted') {
          this.ng4Spinner.hide();
          const row = this.grid_Userdetails.getRowByIndex(rowIndex);
          row.delete();
          this.dialog.close();
          this.toastr.success('User information has been deleted.', 'SUCCESS', {
            timeOut: 5000,
          });
        } else {
          this.dialog.close();
          this.ng4Spinner.hide();
          this.toastr.error('Something went wrong, please try deleting again.', 'ERROR', {
            timeOut: 5000,
          });
        }
      });
  }

  // clear form when cancel button is clicked
  public ClearUserDetails() {
    this.submitted = false;
    this.userheadertext = 'New User';
    this.btnLabelUpdate = 'Add User';
    this.registerForm.controls.Email.enable();
    this.registerForm.controls.RoleName.enable();
   
    this.registerForm.markAsUntouched();
    this.registerForm.controls.RoleName.setValue('2');
    this._default_role = true;
    // Object.keys(this.registerForm.controls).forEach(key => {
    //   this.registerForm.controls[key].setErrors(null);
    // });
    this.registerForm.reset();
    this.registerForm.controls.RoleName.setValue('2');
    this._default_role = true;
  }

  // Search or Filter in the grid
  public filter(term) {
    this.grid_Userdetails.filter('Email', term, IgxStringFilteringOperand.instance().condition('contains'));
    this.grid_Userdetails.markForCheck();
  }

  /// Open the UserAccessDetails page with clicked or selected user
  public userdetail(selecteduser: IUserDetails) {
    //console.log(selecteduser);
    // alert(selecteduser);
    this._userDataProvider.userDetails = selecteduser;
    this.routes.navigate(['/UserAccessDetails']);
  }
}
