import { Component } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IUserDetails } from '../Interfaces/IUserDetails';
import { PasswordSvc } from './../Services/PasswordSvc';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { SessionStorageService } from '../Services/SessionStorageService';
/**
 * @title Basic menu
 */
@Component({
    selector: 'ResetPasswordComponent',
    templateUrl: 'ResetPass.component.html',
    styleUrls: ['./../LoginPage/Login.component.css', 'ResetPass.component.css'],
})
export class ResetPasswordComponent {
    public btnLabelUpdate: string = 'Confirm';
    public PasswordCredentials: IUserDetails[] = [];
    public userId: IUserDetails[] = [];

    submitted = false;
     // public _updateUserinfo: IUserDetails = null;

    ResetPasswordModal: any = {

        Password: String,
        UpdatedBy: String,

    };
    registerForm: FormGroup;

    constructor(private _ResetPasswordSvc: PasswordSvc, private formBuilder: FormBuilder,
        private _storageService: SessionStorageService, private toastr: ToastrService, private router: Router) {
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
    const passwordvaildation = '^(?=.*[a-z])(?!.*\\s)(?!.*[\`\~$^\\[\\](){}\\|\'\,\.\:\;<>\\-\\_^])(?=.*[A-Z])(?!.*\\s)(?!.*[\`\~$^\\[\\](){}\\|\'\,\.\:\;<>\\-\\_^])(?=.*[0-9])(?!.*\\s)(?!.*[\`\~$^\\[\\](){}\\|\'\,\.\:\;<>\\-\\_^])(?=.*[\"\/!@#%*\?\=])(?!.*\\s)(?!.*[\`\~$^\\[\\](){}\\|\'\,\.\:\;<>\\-\\_^]).{7,}$';
    //    const passwordvaildation = '^(?=.*[a-z])(?!.*\\s)(?!.*[\`\~$^\\[\\](){}\\|\'\,\.\:\;<>\\-\\_^])(?=.*[A-Z])(?!.*\\s)(?!.*[\`\~$^\\[\\](){}\\|\'\,\.\:\;<>\\-\\_^])(?=.*[0-9])(?!.*\\s)(?!.*[\`\~$^\\[\\](){}\\|\'\,\.\:\;<>\\-\\_^])(?=.*[\"\/!@#%&*\?\+=])(?!.*\\s)(?!.*[\`\~$^\\[\\](){}\\|\'\,\.\:\;<>\\-\\_^]).{7,}$'; // commented for a bug id 41532
        this.registerForm = this.formBuilder.group({
            Password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(12),
            Validators.pattern(passwordvaildation)]],
            passwordConfirm: ['', [Validators.minLength(8)]],

        }, { validator: this.checkIfMatchingPasswords('Password', 'passwordConfirm') });
    }

    get f() { return this.registerForm.controls; }

    onSubmit() {
        this.submitted = true;
         // stop here if form is invalid
        if (this.registerForm.invalid) {
            return;
        }
        if (this.btnLabelUpdate === 'Confirm') {
           // console.log('Confirmed');



            this.ResetPasswordModal.Password = this.registerForm.value.Password;
            this._ResetPasswordSvc.putUpdatePassword(this.ResetPasswordModal).subscribe(
                (data: Response) => {
                   // console.log(data);
                    if (data.toString() === 'UserUpdated') {
                        this.toastr.success('Password has been updated.', 'SUCCESS', {
                            timeOut: 5000,
                        });
                        this._storageService.clearSession();
                       // this.router.navigate(['/Login']);
                    }
                    if (data.toString() === 'AvailableInLastThreePasswords') {
                        this.toastr.error('Password should be different from last three passwords.', 'ERROR', {
                            timeOut: 5000,
                        });
                    }
                });
            error => {
                console.log(error);
                this.submitted = false;
              //  this.router.navigate(['/Login']);
            };
        }
    }
}


