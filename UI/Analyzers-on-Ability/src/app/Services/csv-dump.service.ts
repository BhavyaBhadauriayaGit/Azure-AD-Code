import { SessionStorageService } from './SessionStorageService';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders,HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IVerificationHistory } from '../HomePage/IVerificationHistory';
import { UtilitySvc } from './UtilitySvc';
import { ICSVInfo } from '../Interfaces/icsvinfo';

const httpHeadersValue = {
  headers: new HttpHeaders({

  })
};


@Injectable()

export class CsvDumpService{

  constructor(private _httpService: HttpClient, private _utilityService: UtilitySvc, private _storageService: SessionStorageService) {
   
  }

  private ipAddress: string = this._utilityService.ipAddress;

  private postanalyzerUrl :string = this.ipAddress + 'VTOnCloudAPI/CSVJSONData/GenerateJSONCSVReport';
  private getAllcsvInstanceUrl:string=this.ipAddress +'VTOnCloudAPI/CSVJSONData/GetALLAnalyzers';
  public CSVAanalyzer: ICSVInfo;


  public getAllCsvInstance(userEmailID, createdBy): Observable<any[]> {
    let dummyHeaders = new HttpHeaders();
    httpHeadersValue.headers = dummyHeaders;
    let headers = new HttpHeaders();

    headers = headers.append('Content-Type', 'application/json');
    headers = headers.append('Authorization', 'bearer ' + this._storageService.Session_AOAOAuth.access_token.toString());
    httpHeadersValue.headers = headers;

    return this._httpService.get<any[]>(this.getAllcsvInstanceUrl + '?userEmailID=' + userEmailID + '&createdBy=' + createdBy, httpHeadersValue);
  }


  public postCSVAnalyzer(csvAanalyzer: any[]): Observable<any>{
    let headers = new HttpHeaders();
    headers = headers.set('Accept', 'application/json');
    headers.append('Cache-Control', 'no-cache');
    headers.append('Cache-Control', 'no-store');
    headers.append('Pragma', 'no-cache');
   headers = headers.append('Authorization', 'bearer ' + this._storageService.Session_AOAOAuth.access_token.toString());
    httpHeadersValue.headers = headers;

   this._storageService.GetAOAOAuthSession();
   this._storageService.Session_AOAOAuth.access_token;
        return this._httpService.post<any>(this.postanalyzerUrl,csvAanalyzer, { headers: headers, responseType: 'blob' as 'json' })
         .pipe((user: any)=>{
          JSON.stringify(user);
          return user;
         });
  }

 

}