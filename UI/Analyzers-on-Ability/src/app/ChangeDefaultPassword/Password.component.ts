
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PasswordSvc } from './../Services/PasswordSvc';
import { IUserDetails } from '../Interfaces/IUserDetails';
import { ToastrService } from 'ngx-toastr';
import { SessionStorageService } from '../Services/SessionStorageService';
import { Router } from '@angular/router';


  //import { MyserviceService } from './myservice.service';
/**
 * @title Basic menu
 */
@Component({
  selector: 'PasswordComponent',
  templateUrl: 'Password.component.html',
  styleUrls: ['./../LoginPage/Login.component.css', 'Password.component.css'],
})
export class PasswordComponent {

  public btnLabelUpdate: String = 'Confirm';
  public PasswordCredentials: IUserDetails[] = [];
  public userId: IUserDetails[] = [];

  public userDetailInfo: IUserDetails;
  public UserName: String;

  submitted = false;


  PasswordModal: any = {
    Email: String,
    IsDefaultUser: Boolean,
    Password: String,
    UpdatedBy: String,
    UserId: Number,
    Name: String
  };
  registerForm: FormGroup;

  constructor(private _PasswordSvc: PasswordSvc, private formBuilder: FormBuilder, private toastr: ToastrService, private _storageService: SessionStorageService, private router: Router) {
    this._storageService.GetUamOAuthSession();
    this._storageService.getUserSession();

  }

  ngOnInit(): void {
    this.registrationFormvalidators();
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



  public registrationFormvalidators() {

    this._storageService.Session_UAMOAuth;

    this._storageService.Session_UserInfo;
    this.UserName = this._storageService.Session_UserInfo.Name;
    const passwordvaildation = '^(?=.*[a-z])(?!.*\\s)(?!.*[\`\~$^\\[\\](){}\\|\'\,\.\:\;<>\\-\\_^])(?=.*[A-Z])(?!.*\\s)(?!.*[\`\~$^\\[\\](){}\\|\'\,\.\:\;<>\\-\\_^])(?=.*[0-9])(?!.*\\s)(?!.*[\`\~$^\\[\\](){}\\|\'\,\.\:\;<>\\-\\_^])(?=.*[\"\/!@#%*\?\=])(?!.*\\s)(?!.*[\`\~$^\\[\\](){}\\|\'\,\.\:\;<>\\-\\_^]).{7,}$'; 
     //const passwordvaildation = '^(?=.*[a-z])(?!.*\\s)(?!.*[\`\~$^\\[\\](){}\\|\'\,\.\:\;<>\\-\\_^])(?=.*[A-Z])(?!.*\\s)(?!.*[\`\~$^\\[\\](){}\\|\'\,\.\:\;<>\\-\\_^])(?=.*[0-9])(?!.*\\s)(?!.*[\`\~$^\\[\\](){}\\|\'\,\.\:\;<>\\-\\_^])(?=.*[\"\/!@#%&*\?\+=])(?!.*\\s)(?!.*[\`\~$^\\[\\](){}\\|\'\,\.\:\;<>\\-\\_^]).{7,}$'; // commented for a bug id 41532
    this.registerForm = this.formBuilder.group({

      Email: ['', [Validators.required, Validators.email]],
      Password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(12),
      Validators.pattern(passwordvaildation)]],
      passwordConfirm: ['', [Validators.minLength(8)]],

    }, { validator: this.checkIfMatchingPasswords('Password', 'passwordConfirm') });
  }

  get f() { return this.registerForm.controls; }

  onSubmit() {
    this.submitted = true;

    if (this.registerForm.invalid) {
      return;
    }
    if (this.btnLabelUpdate === 'Confirm') {
     // console.log('Confirmed');
      this.PasswordModal.Email = this.registerForm.value.Email;
      this.PasswordModal.UpdatedBy = '1';  // Wrong hard coded for now to post the data;
      this.PasswordModal.Password = this.registerForm.value.Password;
      this._PasswordSvc.putUpdatePassword(this.PasswordModal).subscribe(
        (data: Response) => 
        {
          if (data.toString() === 'AvailableInLastThreePasswords') {
            this.toastr.error('Password should be different from last three passwords.', 'ERROR', {
                timeOut: 5000,
            });
        }
         // console.log(data);
         else{ this._storageService.clearSession();
          this.toastr.success('E-mail and password have been updated.', 'SUCCESS', {
            timeOut: 5000,
          });
         // this.router.navigate(['/Login']);
        }

        });
      //   {
      //     // console.log(data);
      //      if (data.toString() === 'UserUpdated') {
      //          this.toastr.success('User password updated successfully!', 'SUCCESS', {
      //              timeOut: 5000,
      //          });
      //          this._storageService.clearSession();
      //          this.router.navigate(['/Login']);
      //      }
      //      if (data.toString() === 'AvailableInLastThreePasswords') {
      //          this.toastr.error('Password should be different from last three Passwords!', 'ERROR', {
      //              timeOut: 5000,
      //          });
      //      }
      //  });
      error => {
        console.log(error);
        this.submitted = false;
      };
    }
  }
}
