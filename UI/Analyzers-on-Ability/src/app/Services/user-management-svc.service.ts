import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subscription } from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { UtilitySvc } from './UtilitySvc';
import { IUserDetails } from '../Interfaces/IUserDetails';
import { SessionStorageService } from './SessionStorageService';

const httpHeadersValue = {
  headers: new HttpHeaders({

  })
};

@Injectable()
export class UserManagementSvcService {



  constructor(private _httpService: HttpClient, private _utilityService: UtilitySvc, private _storageService: SessionStorageService) { }
  private ipAddress: string = this._utilityService.ipAddressUsermanag;
  private getAllUserUrl: string = this.ipAddress + '/api/user/user';
  private postAddUserUrl: string = this.ipAddress + '/api/user';
  IsExpiryPopup=false;

   /// Get all the available user information:
  public getAllUserDetails(): Observable<IUserDetails[]> {
    const dummyheaders = new HttpHeaders();
    httpHeadersValue.headers = dummyheaders;
    let headers = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json');
    headers = headers.append('Authorization', 'bearer ' + this._storageService.Session_UAMOAuth.access_token.toString());
    httpHeadersValue.headers = headers;
    return this._httpService.get<IUserDetails[]>(this.getAllUserUrl, httpHeadersValue);
  }

  public postAddUserDetail(addUserinfo: any): Observable<any> {

    const dummyheaders = new HttpHeaders();
    httpHeadersValue.headers = dummyheaders;
    let headers = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json');
    headers = headers.append('Authorization', 'bearer ' + this._storageService.Session_UAMOAuth.access_token.toString());
    httpHeadersValue.headers = headers;
    console.log(httpHeadersValue.headers);
    return this._httpService.post<any>(this.postAddUserUrl, addUserinfo, httpHeadersValue);

  }

  public putUpdateUserDetail(editUserinfo: any): Observable<any> {
    console.log(editUserinfo);
    const dummyheaders = new HttpHeaders();
    httpHeadersValue.headers = dummyheaders;
    let headers = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json');
    headers = headers.append('Authorization', 'bearer ' + this._storageService.Session_UAMOAuth.access_token.toString());
    httpHeadersValue.headers = headers;
    return this._httpService.put<any>(this.postAddUserUrl + '?emailId=' + editUserinfo.Email, editUserinfo, httpHeadersValue);
  }

  public deleteUserDetail(deleteUserinfo: String): Observable<any> {
    const dummyheaders = new HttpHeaders();
    httpHeadersValue.headers = dummyheaders;
    let headers = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json');
    headers = headers.append('Authorization', 'bearer ' + this._storageService.Session_UAMOAuth.access_token.toString());
    httpHeadersValue.headers = headers;
    return this._httpService.delete<any>(this.postAddUserUrl + '?emailId=' + deleteUserinfo, httpHeadersValue);
  }

}
