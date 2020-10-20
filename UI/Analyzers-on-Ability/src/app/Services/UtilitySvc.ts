import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IVerificationHistory } from '../HomePage/IVerificationHistory';
import { SessionStorageService } from './SessionStorageService';

const httpHeadersValue = {
  headers: new HttpHeaders({

  })
}

@Injectable()
export class UtilitySvc {
  currentURL = '';
  browseripAddress: string = '';

  public ipAddress: string = '';
 // public ipAddress1: string = '';
  public ipAddressUsermanag: string = '';
  public getVerificationHistoryURL: string = '';
  public getVerificationResultURL: string = '';

  constructor(private _httpService: HttpClient, private _storageService: SessionStorageService) {
    this.currentURL = window.location.href;
    // console.log(this.currentURL);
    var ipAddressURL = this.currentURL.split(':');
    this.browseripAddress = ipAddressURL[0] + ":" + ipAddressURL[1];
    this.ipAddress = this.browseripAddress + ':8448/';
    this.ipAddressUsermanag = this.browseripAddress + ':8447/';
  
  // this.ipAddress = "https://10.140.190.51:8448/";
  // this.ipAddressUsermanag = "https://10.140.190.51:8447/";
    this.getVerificationHistoryURL = this.ipAddress + "VTOnCloudAPI/ScheduleVerification/getVerificationHistory";
    this.getVerificationResultURL = this.ipAddress + "VTOnCloudAPI/VerificationResult/getVerificationResult";
    
  }
 

  
  //Lists all the DBGUIDs in the system
  public getVerificationHistory(instanceDBGUID, userEmailID, createdBy): Observable<IVerificationHistory[]> {
    const dummyHeaders = new HttpHeaders();
    console.log(this.getVerificationHistoryURL);
    httpHeadersValue.headers = dummyHeaders;
    let headers = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json');
    headers = headers.append('Authorization', 'bearer ' + this._storageService.Session_AOAOAuth.access_token.toString());
    httpHeadersValue.headers = headers;
    return this._httpService.get<IVerificationHistory[]>(this.getVerificationHistoryURL + '?instanceDBGUID=' +
      instanceDBGUID + '&createdBy=' + createdBy + "&userEmailID=" + userEmailID, httpHeadersValue);
  }

  public getVerificationResult(verificationResultId, userEmailId, createdBy): Observable<any> {
    console.log(this.getVerificationResultURL);
    let headers = new HttpHeaders();
    headers = headers.set('Accept', 'application/pdf');
    headers = headers.append('Authorization', 'bearer ' + this._storageService.Session_AOAOAuth.access_token.toString());
    return this._httpService.get(this.getVerificationResultURL + "?verificationResultId=" + verificationResultId + "&createdBy=" + createdBy + "&userEmailID=" + userEmailId,
      { headers: headers, responseType: 'blob' as 'json' });
  }
}
