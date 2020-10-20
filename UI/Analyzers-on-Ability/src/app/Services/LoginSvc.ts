import { SessionStorageService } from './SessionStorageService';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { UtilitySvc } from './UtilitySvc';
import { IUserDetails } from '../Interfaces/IUserDetails';



@Injectable()
export class LoginServices {
  // currentURL='';
  public httpHeadersValue: any = {
    headers: new HttpHeaders()
  };

  private ipAddress: string = this._utilityService.ipAddressUsermanag;
  private AOAipAddress: string = this._utilityService.ipAddress;
  private UserAuthenticationUrl: string = this.ipAddress + 'api/Auth/UserAuthentication';
  private TokenGenerationUrl: string = this.ipAddress + 'Token';
  private AOATokenGenerationUrl: string = this.AOAipAddress + 'Token';

  constructor(private _httpService: HttpClient, private _utilityService: UtilitySvc, private _storageService: SessionStorageService) {
    this.ipAddress = this._utilityService.ipAddressUsermanag;
    this.AOAipAddress = this._utilityService.ipAddress;
    this.UserAuthenticationUrl = this.ipAddress + 'api/Auth/UserAuthentication';
    this.TokenGenerationUrl = this.ipAddress + 'Token';
    this.AOATokenGenerationUrl = this.AOAipAddress + 'Token';
  }


  // constructor(private _httpService: HttpClient, private _utilityService: UtilitySvc, private _storageService: SessionStorageService) {
  //   this.ipAddress = this._utilityService.ipAddressUsermanag;
  //   this.AOAipAddress = this._utilityService.ipAddress;
  //   this.UserAuthenticationUrl = this.ipAddress + 'UAM/api/Auth/UserAuthentication';
  //   this.TokenGenerationUrl = this.ipAddress + 'UAM/Token';
  //   this.AOATokenGenerationUrl = this.AOAipAddress + 'Token'

  //   console.log(this.ipAddress);
  //   console.log(this.AOAipAddress);
  //   console.log(this.UserAuthenticationUrl);
  //   console.log(this.TokenGenerationUrl);
  //   console.log(this.AOATokenGenerationUrl);
  // }





  public UserAuthentication(AuthInfo: any): Observable<any> {

    let headers = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/x-www-form-urlencoded');
    headers = headers.append('Authorization', 'bearer ' + this._storageService.Session_UAMOAuth.access_token.toString());
    console.log(headers);
    this.httpHeadersValue.headers = headers;
    // console.log(this.httpHeadersValue.headers);

    return this._httpService.post<any>(this.UserAuthenticationUrl, AuthInfo, this.httpHeadersValue);
  }

  // public UserAuthentication(AuthInfo: any): Observable<any> {

  // let headers = new HttpHeaders();
  // headers = headers.append('Content-Type', 'application/x-www-form-urlencoded');
  // headers = headers.append('Access-Control-Allow-Origin', '*');
  // headers = headers.append('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS');
  // headers = headers.append('Access-Control-Allow-Headers','*');
  // headers = headers.append('Authorization', 'bearer ' + this._storageService.Session_UAMOAuth.access_token.toString());
  // console.log(headers);
  // this.httpHeadersValue.headers = headers;
  // console.log(this.httpHeadersValue.headers);
  // return this._httpService.post<any>(this.UserAuthenticationUrl, AuthInfo, this.httpHeadersValue);
  // } 



  public UAMTokenGeneration(RequestBody: any): Observable<any> {
    console.log('LoginSvc IpAddress ' + this.ipAddress);
    console.log('LoginSvc TokenGenerationUrl ' + this.TokenGenerationUrl);
    return this._httpService.post<any>(this.TokenGenerationUrl, RequestBody);
  }

  public AOATokenGeneration(RequestBody: any): Observable<any> {
    return this._httpService.post<any>(this.AOATokenGenerationUrl, RequestBody);
  }
}
