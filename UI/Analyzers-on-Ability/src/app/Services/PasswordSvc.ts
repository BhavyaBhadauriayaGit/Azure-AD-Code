import { SessionStorageService } from './SessionStorageService';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { UtilitySvc } from './UtilitySvc';
import { IUserDetails } from '../Interfaces/IUserDetails';


@Injectable()
export class PasswordSvc {

  public httpHeadersValue: any = {
    headers: new HttpHeaders()
  };

  constructor(private _httpService: HttpClient, private _utilityService: UtilitySvc, private _storageService: SessionStorageService) { }
  private ipAddress: string = this._utilityService.ipAddressUsermanag;
  private postAddUserUrl: string = this.ipAddress + 'api/user';


  public putUpdatePassword(updateUser: any): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json');
    headers = headers.append('Authorization', 'bearer ' + this._storageService.Session_UAMOAuth.access_token.toString());
    this.httpHeadersValue.headers = headers;
   // console.log(this.httpHeadersValue.headers);

    return this._httpService.put<any>(this.postAddUserUrl + '?emailId=' + this._storageService.Session_UserInfo.Email, updateUser, this.httpHeadersValue);
  }

}
