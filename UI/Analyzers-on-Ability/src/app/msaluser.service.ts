import { Injectable } from '@angular/core';
import * as Msal from 'msal';
import { environment } from '../environments/environment';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class MsaluserService {
  private accessToken: any;
  public clientApplication: Msal.UserAgentApplication = null;
  constructor() {
    environment.clientId, environment.authority,
    'https://login.microsoftonline.com/' + environment.tenantId,
    this.authCallback,
    { storeAuthStateInCookie: true,
      //cacheLocation: 'localStorage' ,
  }

 
}

  public GetAccessToken(): Observable<any> {
    if (sessionStorage.getItem('msal.idtoken') !== undefined && sessionStorage.getItem('msal.idtoken') != null) {
      this.accessToken = sessionStorage.getItem('msal.idtoken');
      console.log(this.accessToken);
    }
    return this.accessToken;
  }

  public authCallback(errorDesc, token, error, tokenType) {
    if (token) {

    } else {
      console.log(error + ':' + errorDesc);
    }
  }

  // public getCurrentUserInfo() {
  //   const user = this.clientApplication.getUser();
  //   alert(user.name);
  // }

  public logout() {
    this.clientApplication.logout();
  }
}