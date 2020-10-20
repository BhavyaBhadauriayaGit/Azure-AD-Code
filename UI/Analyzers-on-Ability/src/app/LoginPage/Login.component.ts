
import { environment } from './../../environments/environment';

import { Component } from '@angular/core';
import { IUserDetails } from '../Interfaces/IUserDetails';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginServices } from '../Services/LoginSvc';
import { SessionStorageService } from '../Services/SessionStorageService';
import { Router } from '@angular/router';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { MsaluserService } from '../msaluser.service';
import {
  IgxGridComponent, IgxNumberSummaryOperand, IgxStringFilteringOperand,
  IgxSummaryResult, IgxDialogComponent, IgxGridRowComponent
} from 'igniteui-angular';
import { ToastrService } from 'ngx-toastr';
/**
 * @title Basic menu
 */
@Component({
  selector: 'Login',
  templateUrl: 'Login.component.html',
  styleUrls: ['Login.component.css'],
})
export class LoginComponent {

  public title:string = environment.title;
  public dialog: IgxDialogComponent;
  public _Logindetails: IUserDetails[] = [];
  submitted = false;
  public btnLabelUpdate = 'Login';

  public UserInfo: any;
  public UAMOAuth: any;
  public AOAOAuth: any;
  public errorMessage = '';
  public IsPasswordExpired: false;

  loginCredentials: any = {
    Email: String,
    Password: String,
  };
  registerForm: FormGroup;

  constructor(private _LoginSvc: LoginServices, private formBuilder: FormBuilder, private ng4Spinner: Ng4LoadingSpinnerService,
    private toastr: ToastrService, private _storageService: SessionStorageService, private router: Router,private msal:MsaluserService) {
  }
 


  ngOnInit(): void {

    this.registrationFormvalidators();

  }
  public registrationFormvalidators() {
    this.registerForm = this.formBuilder.group({

      Email: ['', [Validators.required, Validators.email]],
      Password: ['', [Validators.required, Validators.minLength(8),
      ]],

    });
  }
  get f() { return this.registerForm.controls; }

  onSubmit() {
    this.errorMessage = '';
     // this.dialogbox();
    this.ng4Spinner.show();
     // console.log('clicked');
    this.submitted = true;
     // stop here if form is invalid
    if (this.registerForm.invalid) {
      this.ng4Spinner.hide();
      return;
    }
    if (this.btnLabelUpdate === 'Login') {
     // console.log('login');
      this.loginCredentials.Email = this.registerForm.value.Email;
      this.loginCredentials.Password = (this.registerForm.value.Password);
      //console.log(this.loginCredentials.Password);
      this.UAMTokenGeneration();
    }
   
  }


  UAMTokenGeneration() {
    //console.log(this.loginCredentials.Password);
     // this.ng4Spinner.show();
    var requestbody = 'Username=' + this.loginCredentials.Email + '&Password='
      + this.loginCredentials.Password + '&grant_type=password';
    this._LoginSvc.UAMTokenGeneration(requestbody).subscribe(
      (data: Response) => {
        this.UAMOAuth = data;
        this.SetUAMOAuthSession(this.UAMOAuth);
        this._storageService.GetUamOAuthSession();
         // this.ng4Spinner.hide();
        this.UserAuthentication();
        

      },
      error => {
        //console.log(error);
        this.errorMessage = '';
         // if(this._storageService.Session_UserInfo.IsPasswordExpired==false){
        this.errorMessage = 'E-mail or Password is incorrect.';
        this.ng4Spinner.hide();
      
        let errorcounter: any = error.error.error_description.split(':');
        if (errorcounter) {
          let splitLogincounter: Number = errorcounter[1];
          if (splitLogincounter > 2) {
            this.errorMessage = 'User account is locked.';
            this.toastr.error('Your account is locked due to multiple incorrect login attempts.', 'INFO', {
              timeOut: 5000,
            });
          } else if (splitLogincounter > 1) {
            this.errorMessage = 'E-mail or Password is incorrect.';
            this.toastr.error('This is second incorrect login attempt.', 'INFO', {
              timeOut: 5000,
            });
          } else {

          }
        }

       
    
         // }
         // else{
         //   this.errorMessage='Password expired... Contact your superuser for new password.'
         // }

      }
    );
  }

  AOATokenGenerationToHomePage() {
    const requestbody = 'Username=' + this.loginCredentials.Email +
      '&Password=' + this._storageService.Session_UAMOAuth.access_token + '&grant_type=password';
    this._LoginSvc.AOATokenGeneration(requestbody).subscribe(
      (data: Response) => {
        this.AOAOAuth = data;
        this.SetAOAOAuthSession(this.AOAOAuth);
        this._storageService.GetAOAOAuthSession();
        this.router.navigate(['/home']);
         // this.ng4Spinner.hide();
      },
      error => {
        this.ng4Spinner.hide();
        console.log(error);
      }
    );
  }

  AOATokenGeneration() {
    const requestbody = 'Username=' + this.loginCredentials.Email + '&Password=' + this._storageService.Session_UAMOAuth.access_token + '&grant_type=password';
    this._LoginSvc.AOATokenGeneration(requestbody).subscribe(
      (data: Response) => {
        this.AOAOAuth = data;
        this.SetAOAOAuthSession(this.AOAOAuth);
        this._storageService.GetAOAOAuthSession();
         // this.ng4Spinner.hide();
        this.router.navigate(['/home']);
       
      },
      error => {
        this.ng4Spinner.hide();
        console.log(error);
      }
    );
  }

  public UserAuthentication() {
    this.ng4Spinner.show();
    var requestbody = 'Email=' + this.loginCredentials.Email + '&Password=' + this.loginCredentials.Password;
    this._LoginSvc.UserAuthentication(requestbody)
      .subscribe(
        (data: Response) => {
          this.UserInfo = data;
          if (this.UserInfo.IsLocked === 'true' || this.UserInfo.IsLocked === true || this.UserInfo.IsLocked === 1) {
            this.errorMessage = 'User account locked';
            this.ng4Spinner.hide();
          }
          else {
            this.setUserSession();
            this._storageService.getUserSession();
            this.AOATokenGenerationToHomePage();
            this._storageService.GetAOAOAuthSession();
          }
           // this.ng4Spinner.hide();
        },
        error => {
          this.ng4Spinner.hide();
          this.errorMessage = 'E-mail or Password is incorrect !';
          console.log(error);
        });
  }

  public setUserSession() {
     //var userinfo : string = JSON.stringify(this.UserInfo);
    this._storageService.setSession('UserSession', this.UserInfo);
  }

  public SetUAMOAuthSession(UamOAuth: any) {
    this._storageService.setSession('UAMOAuthSession', UamOAuth);
  }



  public SetAOAOAuthSession(UamOAuth: any) {
    this._storageService.setSession('AOAOAuthSession', UamOAuth);
  }

  public clearSession() {
    this._storageService.clearSession();
  }

}
