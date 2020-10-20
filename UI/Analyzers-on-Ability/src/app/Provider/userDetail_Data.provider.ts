import { Injectable } from '@angular/core';
import { IUserDetails } from '../Interfaces/IUserDetails';

@Injectable()
export class UserDataProvider {

    public userDetails: IUserDetails;
    public _createNew_status: boolean;

    public constructor() { }

}
