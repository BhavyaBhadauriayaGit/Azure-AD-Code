import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders  } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IVerificationHistory } from '../HomePage/IVerificationHistory';
import { UtilitySvc } from './UtilitySvc';
import { SessionStorageService } from './SessionStorageService';
import { timeout } from 'rxjs/operators';

const httpHeadersValue = {
    headers: new HttpHeaders({
  
    })
  };
@Injectable()
export class IndividualDeviceSvc {
    constructor(private _httpService: HttpClient, private _utilitySvc: UtilitySvc, private _storageService: SessionStorageService) {
        this.ipAddress = this._utilitySvc.ipAddress;
        this.getAllInstanceUrl = this.ipAddress + 'VTOnCloudAPI/ScheduleVerification/getAllInstance';    
        this.getAllInstanceReport = this.ipAddress + '/VTOnCloudAPI/OnDemandReport/getInstanceReport';
       // console.log(this.getAllInstanceUrl);
       // console.log( this.getAllInstanceReport);
    }
    private ipAddress: string = this._utilitySvc.ipAddress;
    private getAllInstanceUrl: string = this.ipAddress + 'VTOnCloudAPI/ScheduleVerification/getAllInstance';

    private getAllInstanceReport: string = this.ipAddress + '/VTOnCloudAPI/OnDemandReport/getInstanceReport';
    comVerificationHistory: IVerificationHistory;

    public pushVerificationDataFromHomePage(homeVerificationHistory: IVerificationHistory) {
        this.comVerificationHistory = homeVerificationHistory;
    }

    public getVerificationDataFromHomePage(): IVerificationHistory {
        if( this.comVerificationHistory.ResultVerificationId.toString() === '') {
            this.comVerificationHistory.ResultVerificationId = 0;
        }
        return this.comVerificationHistory;
    }

    public getInstanceReport(instanceDBGUID, userEmailID): Observable<string> 
    {
      let headers = new HttpHeaders();
      headers = headers.append('Content-Type', 'application/json');
      headers = headers.append('Authorization', 'bearer ' + this._storageService.Session_AOAOAuth.access_token.toString());
      httpHeadersValue.headers = headers;
      // console.log(httpHeadersValue.headers);
      this._storageService.GetAOAOAuthSession();
      this._storageService.Session_AOAOAuth.access_token;
      return this._httpService.get<string>(this.getAllInstanceReport + '?deviceDBGUID=' + instanceDBGUID + '&userEmailID=' + userEmailID, httpHeadersValue)
.pipe(timeout(60000000))
      .catch((err) => {
           // Do messaging and error handling here
           //alert('in the service');
          return Observable.throw(err);
        });
    }
}
