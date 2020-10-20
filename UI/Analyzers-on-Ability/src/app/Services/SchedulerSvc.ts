import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ISchedulerInfo, IschedulerAlramInfo } from '../Interfaces/IScheduleInfo';
import { IVerificationHistory } from './../HomePage/IVerificationHistory';
import { UtilitySvc } from './UtilitySvc';
import { SessionStorageService } from './SessionStorageService';
const httpHeadersValue = {
    headers: new HttpHeaders({
  
    })
  };
@Injectable()
export class SchedulerSvc {
    constructor(private _httpService: HttpClient, private _utilitySvc: UtilitySvc, private _storageService: SessionStorageService) {

    }
    private ipAddress: string = this._utilitySvc.ipAddress;
    private postScheduleUrl: string = this.ipAddress + 'VTOnCloudAPI/ScheduleVerification/postSchedule';
    private deleteScheduleUrl: string = this.ipAddress + 'VTOnCloudAPI/ScheduleVerification/deleteSchedule';
    //url for update alram details
  private postarlamupdateurl: string = this.ipAddress +'VTOnCloudAPI/EventBased/UpdateAnalyzer';
    
    private schedulerInfo: ISchedulerInfo;
    pullSchedulerInfo: IVerificationHistory;

    public postSchedule(scheduleInput: ISchedulerInfo): Observable<any> {
        let headers = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json');
    headers = headers.append('Authorization', 'bearer ' + this._storageService.Session_AOAOAuth.access_token.toString());
    httpHeadersValue.headers = headers;
   // console.log(httpHeadersValue.headers);
    this._storageService.GetAOAOAuthSession();
    this._storageService.Session_AOAOAuth.access_token;
        return this._httpService.post<any>(this.postScheduleUrl, scheduleInput, httpHeadersValue);
        
    }

    
    public UpdateScheduleralram(schedulerAlaramInput: IschedulerAlramInfo): Observable<any> {
        let headers = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json');
    headers = headers.append('Authorization', 'bearer ' + this._storageService.Session_AOAOAuth.access_token.toString());
    httpHeadersValue.headers = headers;
   // console.log(httpHeadersValue.headers);
    this._storageService.GetAOAOAuthSession();
    this._storageService.Session_AOAOAuth.access_token;
        return this._httpService.post<any>(this.postarlamupdateurl, schedulerAlaramInput, httpHeadersValue);
        
    }





    public postScheduleNoParam() {
      //  console.log('noexecute')
        this.postSchedule(this.schedulerInfo).subscribe(
            
            data => { //console.log(data); 
            },
            error => {
                console.log('UserEmailID: ' + 'sanoob.husain@in.abb.com' + ' CreatedBy: ' +
                    'sanoob.husain@in.abb.com' + ' Error: ' + error);
            }
        );

    }

    public deletSchedule(instanceDBGUID, createdBy): Observable<any> {
        let headers = new HttpHeaders();
        headers = headers.append('Content-Type', 'application/json');
        headers = headers.append('Authorization', 'bearer ' + this._storageService.Session_AOAOAuth.access_token.toString());
        httpHeadersValue.headers = headers;
       // console.log(httpHeadersValue.headers);
        this._storageService.GetAOAOAuthSession();
        this._storageService.Session_AOAOAuth.access_token;
        return this._httpService.get<any>(this.deleteScheduleUrl + '?instanceDBGUID=' + instanceDBGUID + '&createdBy=' + createdBy,httpHeadersValue);
    }

}
