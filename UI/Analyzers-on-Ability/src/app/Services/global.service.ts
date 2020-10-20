import { SessionStorageService } from './SessionStorageService';
import { Injectable, OnInit } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { UtilitySvc } from './UtilitySvc';
import { Observable } from 'rxjs';
import * as moment from 'moment';


const httpHeadersValue = {
  headers: new HttpHeaders({

  })
}

@Injectable()
export class GlobalService implements OnInit {
  public UTCOffset: string = '+05:30:00';
  public UTCOffsetHours = 5;
  public UTCOffsetMinutes= 30;
  public UTCOffsetAhead = true;
  public SystemTimeZone: string;


  ngOnInit(): void {

  }

  constructor(private _httpService: HttpClient, private _utilityService: UtilitySvc,private _storageService: SessionStorageService) {
    // this.getTimeZone(_storageService.Session_UserInfo.Email).subscribe(
      this.getTimeZone("alok@iamaorg.onmicrosoft.com").subscribe(
      data => {
        setTimeout(() => {
          if (data !== null) {
            this.UTCOffset = data['UTCoffset'];
            this.SystemTimeZone = data['localzoneUTC'];
            if (this.UTCOffset !== null && this.UTCOffset !== '') {
              if (this.UTCOffset.substr(0, 1) == '-') {
                this.UTCOffsetAhead = false;
                this.UTCOffsetHours = parseInt(this.UTCOffset.substr(1, 2));
                this.UTCOffsetMinutes = parseInt(this.UTCOffset.substr(4, 2));
              }
              else {
                this.UTCOffsetHours = parseInt(this.UTCOffset.substr(0, 2));
                this.UTCOffsetMinutes = parseInt(this.UTCOffset.substr(3, 2));
              }
            }
          }
        }, 1000)
      },
      error => {
      }
    );
  }
  public getTimeZone(userEmailID): Observable<any[]> {
let dummyHeaders = new HttpHeaders();
    httpHeadersValue.headers = dummyHeaders;
    let headers = new HttpHeaders();

    headers = headers.append('Content-Type', 'application/json');
    //headers = headers.append('Authorization', 'bearer ' + this._storageService.Session_AOAOAuth.access_token.toString());
    httpHeadersValue.headers = headers;
    return this._httpService.get<any>(this._utilityService.ipAddress + 'VTOnCloudAPI/TimeZone/GetTimeZoneinfo' + '?userEmailID=' + userEmailID, httpHeadersValue);
  }
  public SetUTCOffsetDateTime(utcDateTime: any): any {
    if (utcDateTime !== null && utcDateTime !== '') {
      let value = '';
      if (this.UTCOffsetAhead) {
        value = moment(utcDateTime, 'DD-MM-YYYY HH:mm:ss').add(this.UTCOffsetHours, 'h').add(this.UTCOffsetMinutes, 'm').format('DD-MM-YYYY HH:mm:ss');
      }
      else {
        value = moment(utcDateTime, 'DD-MM-YYYY HH:mm:ss').subtract(this.UTCOffsetHours, 'h').subtract(this.UTCOffsetMinutes, 'm').format('DD-MM-YYYY HH:mm:ss');
      }
      return value;
    }
    else
      return utcDateTime;
  }
  public GetUTCDateTime(currentDateTime: any): any {
    if (currentDateTime !== null && currentDateTime !== '') {
      let value = '';
      if (this.UTCOffsetAhead) {
        value = moment(currentDateTime, 'DD-MM-YYYY HH:mm:ss').subtract(this.UTCOffsetHours, 'h').subtract(this.UTCOffsetMinutes, 'm').format('DD-MM-YYYY HH:mm:ss');
      }
      else {
        value = moment(currentDateTime, 'DD-MM-YYYY HH:mm:ss').add(this.UTCOffsetHours, 'h').add(this.UTCOffsetMinutes, 'm').format('DD-MM-YYYY HH:mm:ss');
      }
      return value;
    }
    else
      return currentDateTime;
  }
  public SetUTCOffsetTime(utcTime: any): any {
    if (utcTime !== null && utcTime !== '') {
      let value = '';
      if (this.UTCOffsetAhead) {
        value = moment(utcTime, 'HH:mm').add(this.UTCOffsetHours, 'h').add(this.UTCOffsetMinutes, 'm').format('HH:mm');
      }
      else {
        value = moment(utcTime, 'HH:mm').subtract(this.UTCOffsetHours, 'h').subtract(this.UTCOffsetMinutes, 'm').format('HH:mm');
      }
      return value;
    }
    else
      return utcTime;
  }
  public GetUTCTime(currentTime: any): any {
    if (currentTime !== null && currentTime !== '') {
      let value = '';
      if (this.UTCOffsetAhead) {
        value = moment(currentTime, 'HH:mm').subtract(this.UTCOffsetHours, 'h').subtract(this.UTCOffsetMinutes, 'm').format('HH:mm');
      }
      else {
        value = moment(currentTime, 'HH:mm').add(this.UTCOffsetHours, 'h').add(this.UTCOffsetMinutes, 'm').format('HH:mm');
      }
      return value;
    }
    else
      return currentTime;
  }
}
