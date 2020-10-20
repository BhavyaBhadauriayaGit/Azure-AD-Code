import { SessionStorageService } from './SessionStorageService';

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IVerificationHistory } from '../HomePage/IVerificationHistory';
import { UtilitySvc } from './UtilitySvc';


const httpHeadersValue = {
  headers: new HttpHeaders({

  })
};

@Injectable()
export class HomeService {

  private ipAddress: string = this._utilityService.ipAddress;
  private getAllInstanceUrl: string = this.ipAddress + 'VTOnCloudAPI/ScheduleVerification/getAllInstance';
  private getAssignedAbilityGUIDUrl: string = this.ipAddress + 'VTOnCloudAPI/UserDeviceAccess/getAssignedAbilityGUID';
  private getVerificationHistoryURL: string = this.ipAddress + 'VTOnCloudAPI/ScheduleVerification/getVerificationHistory';
  private lastVerificationSummaryURL: string = this.ipAddress + 'VTOnCloudAPI/PlantLevelVerification/getLastVerificationSummary';
  private getAllAlaramdetails:string= this.ipAddress +'VTOnCloudAPI/getanalyzer/index';


  constructor(private _httpService: HttpClient, private _utilityService: UtilitySvc, private _storageService: SessionStorageService) {
    this.ipAddress = this._utilityService.ipAddress;
    this.getAllInstanceUrl = this.ipAddress + 'VTOnCloudAPI/ScheduleVerification/getAllInstance';
    this.getAssignedAbilityGUIDUrl = this.ipAddress + 'VTOnCloudAPI/UserDeviceAccess/getAssignedAbilityGUID';
    this.getVerificationHistoryURL = this.ipAddress + 'VTOnCloudAPI/ScheduleVerification/getVerificationHistory';
    this.lastVerificationSummaryURL = this.ipAddress + 'VTOnCloudAPI/PlantLevelVerification/getLastVerificationSummary';
     this.getAllAlaramdetails=this.ipAddress +'VTOnCloudAPI/EventBased/Getanalyzer/index';


    //  console.log(this.ipAddress);
     //  console.log(this.getAllInstanceUrl);
     //  console.log(this.getAssignedAbilityGUIDUrl);
     //  console.log(this.getVerificationHistoryURL);
     //  console.log(this.lastVerificationSummaryURL);
  }

  private _instanceList: any[];
  private _dbGUIDList: any[];
  private _verificationHistoryList: any[];

   //Carousel -- getAllInstance will return all the scheduled Verifications
  public getAllInstance(userEmailID, createdBy): Observable<any[]> {
    let dummyHeaders = new HttpHeaders();
    httpHeadersValue.headers = dummyHeaders;
    let headers = new HttpHeaders();

    headers = headers.append('Content-Type', 'application/json');
    headers = headers.append('Authorization', 'bearer ' + this._storageService.Session_AOAOAuth.access_token.toString());
    httpHeadersValue.headers = headers;

    return this._httpService.get<any[]>(this.getAllInstanceUrl + '?userEmailID=' + userEmailID + '&createdBy=' + createdBy, httpHeadersValue);
  }


  //get alaram values for scheduler

  public getAllAlaramvalues(Analyzdbguid): Observable<any[]> {
    let dummyHeaders = new HttpHeaders();
    httpHeadersValue.headers = dummyHeaders;
    let headers = new HttpHeaders();

    headers = headers.append('Content-Type', 'application/json');
    headers = headers.append('Authorization', 'bearer ' + this._storageService.Session_AOAOAuth.access_token.toString());
    httpHeadersValue.headers = headers;

    return this._httpService.get<any[]>(this.getAllAlaramdetails + '?dbguid=' + Analyzdbguid, httpHeadersValue);
  }
   //Lists all the DBGUIDs in the system
  public getAssignedAbilityGUID(userEmailID, createdBy): Observable<any> {
    
    let dummyHeaders = new HttpHeaders();
    httpHeadersValue.headers = dummyHeaders;
    let headers = new HttpHeaders();

    headers = headers.append('Content-Type', 'application/json');
    headers = headers.append('Authorization', 'bearer ' + this._storageService.Session_AOAOAuth.access_token.toString());
    httpHeadersValue.headers = headers;
    return this._httpService.get(this.getAssignedAbilityGUIDUrl + '?userEmailID=' + userEmailID + '&createdBy=' + createdBy, httpHeadersValue);
  }

   //piechart api
  public lastVerificationSummary(userEmailID, createdBy): Observable<any> {
    let dummyHeaders = new HttpHeaders();
    httpHeadersValue.headers = dummyHeaders;
    let headers = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json');
    headers = headers.append('Authorization', 'bearer ' + this._storageService.Session_AOAOAuth.access_token.toString());
    httpHeadersValue.headers = headers;
    return this._httpService.get(this.lastVerificationSummaryURL + '?userEmailID=' + userEmailID + '&createdBy=' + createdBy, httpHeadersValue);

  }

   //  //Lists all the DBGUIDs in the system
  public getVerificationHistory(instanceDBGUID, userEmailID, createdBy): Observable<IVerificationHistory[]> {
   // console.log('Home IpAddress ' + this.ipAddress);
   // console.log('HomeSvc URl ' + this.getVerificationHistoryURL);
    let dummyHeaders = new HttpHeaders();
    httpHeadersValue.headers = dummyHeaders;
    let headers = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json');
    headers = headers.append('Authorization', 'bearer ' + this._storageService.Session_AOAOAuth.access_token.toString());
    httpHeadersValue.headers = headers;
    return this._httpService.get<IVerificationHistory[]>(this.getVerificationHistoryURL + '?instanceDBGUID=' + instanceDBGUID + '&createdBy=' + createdBy + '&userEmailID=' + userEmailID, httpHeadersValue);
  }

}

