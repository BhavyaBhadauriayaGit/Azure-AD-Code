
import { Inject, Injectable } from '@angular/core';
import { SESSION_STORAGE, StorageService } from 'angular-webstorage-service';
import { IUserDetails } from './../Interfaces/IUserDetails';
import { IUAMOAuth } from './../Interfaces/IUAMOAuth';
import { IAOAOAuth } from './../Interfaces/IAOAOAuth';

@Injectable()
export class SessionStorageService {
    public Session_UserInfo: IUserDetails;
    public Session_UAMOAuth: IUAMOAuth;
    public Session_AOAOAuth: IAOAOAuth;
    public IsPExpirtyNotified: boolean = false;
  
    constructor(@Inject(SESSION_STORAGE) private storage: StorageService) {
    }
    public setSession(skey: string, svalue: string) {
        this.storage.set(skey, svalue);
    }
    public getSession(skey: string): any {
        return this.storage.get(skey);
    }

    public clearSession() {
        this.Session_UserInfo = null;
        this.Session_AOAOAuth = null;
        this.Session_UAMOAuth = null;

        window.sessionStorage.clear();
        this.IsPExpirtyNotified = false;
    }

    public getUserSession() {
        this.Session_UserInfo = this.getSession('UserSession');
    }

    public GetUamOAuthSession() {
        this.Session_UAMOAuth = this.getSession('UAMOAuthSession');
    }

    public GetAOAOAuthSession() {
        this.Session_AOAOAuth = this.getSession('AOAOAuthSession');
    }
}