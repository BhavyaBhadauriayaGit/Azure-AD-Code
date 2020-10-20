import { StorageService } from 'angular-webstorage-service';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { UtilitySvc } from './UtilitySvc';
import { IUserAccessDetails } from '../Interfaces/IUserAccessDetails';
import { SessionStorageService } from './SessionStorageService';

const httpHeadersValue = {
  headers: new HttpHeaders({
  })
};

@Injectable({
  providedIn: 'root'
})
export class UserdetailssvcService {
  constructor(private _httpService: HttpClient, private _utilityService: UtilitySvc, private _storageService: SessionStorageService) { }
  private ipAddress: string = this._utilityService.ipAddress;
  private postAssignedAbilityGUID: string = this.ipAddress + 'VTOnCloudAPI/UserDeviceAccess/postAssignedAbilityGUID';
  private getAssignedAbilityGUID: string = this.ipAddress + 'VTOnCloudAPI/UserDeviceAccess/getAssignedAbilityGUID';
  private deleteAssignedAbilityGUID: string = this.ipAddress + '/VTOnCloudAPI/UserDeviceAccess/deleteAssignedAbilityGUID';


   /// Get all the available user device access information:
  public getAssignedAbilityDBGUID(userEmailID, createdBy): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json');
    headers = headers.append('Authorization', 'bearer ' + this._storageService.Session_AOAOAuth.access_token.toString());
    httpHeadersValue.headers = headers;

    return this._httpService.get<any>(this.getAssignedAbilityGUID
      + '?userEmailID=' + userEmailID + '&createdBy=' + createdBy, httpHeadersValue)
      .map(res => res);
  }

  public postAssignedAbilityDBGUID(addDevicetoUserinfo: any): Observable<any> {
    const dummyHeaders = new HttpHeaders();
    httpHeadersValue.headers = dummyHeaders;
    let headers = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json');
    headers = headers.append('Authorization', 'bearer ' + this._storageService.Session_AOAOAuth.access_token.toString());
    httpHeadersValue.headers = headers;

    return this._httpService.post<any>(this.postAssignedAbilityGUID, addDevicetoUserinfo, httpHeadersValue)
      .map((res: Response) => res);
  }

  public deleteAssignedAbilityDBGUID(deleteUserinfo: IUserAccessDetails): Observable<any> {
    const dummyHeaders = new HttpHeaders();
    httpHeadersValue.headers = dummyHeaders;
    let headers = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json');
    headers = headers.append('Authorization', 'bearer ' + this._storageService.Session_AOAOAuth.access_token.toString());
    httpHeadersValue.headers = headers;
    return this._httpService.get<any>(this.deleteAssignedAbilityGUID + '?userEmailId=' + deleteUserinfo.UserEmailId
      + '&instanceDBGUID=NX01_' + deleteUserinfo.InstanceDBGUID + '&updatedBy=' + deleteUserinfo.UpdatedBy, httpHeadersValue)
      .map((res: Response) =>
        res
      );
  }


}
