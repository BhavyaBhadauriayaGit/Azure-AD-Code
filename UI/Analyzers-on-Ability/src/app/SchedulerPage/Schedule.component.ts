import { environment } from './../../environments/environment';
import { IUserDetails } from './../Interfaces/IUserDetails';
import { SessionStorageService } from './../Services/SessionStorageService';

import { SchedulerSvc } from './../Services/SchedulerSvc';
import { ISchedulerInfo, IschedulerAlramInfo } from './../Interfaces/IScheduleInfo';
import { HomeService } from './../Services/HomeService';
import { IVerificationHistory } from '../HomePage/IVerificationHistory';
import { Component, OnInit, Inject, ViewChild, ViewEncapsulation, ViewContainerRef } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Searchfilterpipe } from './SearchFilter.pipe';
import {
  IgxGridComponent, IgxNumberSummaryOperand, IgxStringFilteringOperand, IgxSummaryResult, IgxDialogComponent, IgxGridRowComponent
} from 'igniteui-angular';
import { Router } from '@angular/router';
import { AppComponent } from '../app.component';

import { Scheduler } from 'rxjs';
import { GlobalService } from '../Services/global.service';
import * as moment from 'moment';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl, FormsModule, NgForm } from '@angular/forms';
import { element } from 'protractor';

@Component({
  selector: 'SchedulerComponent',
  templateUrl: 'Schedule.component.html',
  styleUrls: ['Schedule.component.css', './../HomePage/HomePage.component.css']
})


export class SchedulerComponent {
  public Title: string = environment.Title;
  @ViewChild('dialogConfirm', { read: IgxDialogComponent })
  public dialog: IgxDialogComponent;
  @ViewChild('dialogFormsubmit', { read: IgxDialogComponent })
  public dialogform: IgxDialogComponent;
  public LoggedInUser: IUserDetails;

  public schedulerInfo: ISchedulerInfo;
  public SchedulerAlramInfo: IschedulerAlramInfo
  public InstanceDBGUID: string;
  public Name: string;
  public TagName: string;
  public ServIS_Id: string;
  public SchedType: string;
  public SchedValue: string;
  public SchedTime: string;
  public CreatedBy: string;
  public deleteDbguid: string;
  public isEdit = false;
  public showDiv = false;
  public showtextbox = true;
  public searchinstance: string;
  public _schedulerInstanceList: IVerificationHistory[] = [];
  public _FetchAlramdetails: any[] = [];

  public weekdays: Weekdaysinterface[] = [];
  valueoftype = 'NA';
  //options = ['DLY', 'WKL', 'MTL'];
  options = [{ name: 'Daily', value: 'DLY' }, { name: 'Weekly', value: 'WKL' }, { name: 'Monthly', value: 'MTL' }];
  public monthlyAllDays: Number[] = [];
  public leadingalarm = "Leading edge";
  public trailingalarm = "Trailing edge"
  public Alaram = `${this.trailingalarm} + ${this.leadingalarm}`;
  model: any = new formmodel();

  constructor(private _HomeService: HomeService, private _schedulerService: SchedulerSvc,
    private toastr: ToastrService, private routes: Router, public _GlobalService: GlobalService,
    private _storageService: SessionStorageService, private appComponent: AppComponent) {
    if (this._storageService.Session_UserInfo) {
      if (this._storageService.Session_UserInfo.IsDefaultUser) {
        this.routes.navigate(['/ResetPass']);
      }
      if (this._storageService.Session_UserInfo.IsAbbEmail) {
        this.routes.navigate(['/Password']);
      }
    } else {
      this._storageService.clearSession();
      //this.routes.navigate(['/Login']);
    }

    this.LoggedInUser = this._storageService.Session_UserInfo;
    appComponent.ngIdleImplementation();

  }
  ngOnInit(): void {
    this.getAllInstance();
    this.loaddropdownvalues();
  }

  ngOnDestroy() {
    this.appComponent.resetTimeOut();
  }



  // optionSelected: any;


  onOptionSelected(type, valueoftype) {
    //console.log('Type' + type); // option value will be sent as event
    //console.log('Value' + valueoftype);

    this.model.SchedType = type;
    // console.log(this.SchedType);
    if (valueoftype) {
      this.model.SchedValue = valueoftype;
      // this.showtextbox = false;
    } else {
      this.model.SchedValue = 'NA';
      // console.log('Type' + this.SchedValue);
    }
  }
  onNoClick(): void {
    this.isEdit = false;
    this.model.LeadingEdge="";
    this.model.TrailingEdge="";
    this.dialogform.close();
  }

  public loaddropdownvalues() {

    // weekely data dropdown for type week
    const options1 = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    for (let weekindex = 0; weekindex < options1.length; weekindex++) {
      const weekdayandvalue: Weekdaysinterface = { dayname: options1[weekindex], value: weekindex };
      weekdayandvalue.dayname = options1[weekindex];
      weekdayandvalue.value = weekindex + 1;
      //console.log(weekdayandvalue);
      this.weekdays.push(weekdayandvalue);
    }

    // Monthly data dropdown for type monthly
    for (let monthindex = 1; monthindex <= 28; monthindex++) {
      this.monthlyAllDays.push(monthindex);
    }

    // console.log(this.weekdays);
    // console.log(this.monthlyAllDays);
  }


  //get alaram values
  public getallalramvalues(Analyzerdetails) {
    this._FetchAlramdetails=[];
    Analyzerdetails.forEach(element => {
      if (element.Tag != "") {
        this._HomeService.getAllAlaramvalues(element.DBGUID).subscribe(data => {
         // console.log(element.Dbguid);
if(data != null)
{
  var alrmdata = JSON.parse(JSON.stringify(data));
  var almobj = JSON.parse(alrmdata);
  this._FetchAlramdetails.push(almobj);
}
        
        })
      }


    });



  }

  public getAllInstance() {
    this._schedulerInstanceList = [];
    this._HomeService.getAllInstance(this._storageService.Session_UserInfo.Email,
      this._storageService.Session_UserInfo.Email).subscribe(
        data => {
          this.getallalramvalues(data);
          this._schedulerInstanceList = data as IVerificationHistory[];
          this._schedulerInstanceList.forEach(element => {
            element = this.SetUTCOffSetValue(element);

          });
          //console.log(data);

        },
        error => {
          console.log('UserEmailID: ' + this._storageService.Session_UserInfo.Email +
            ' CreatedBy: ' + this._storageService.Session_UserInfo.Email + ' Error: ' + error);
        }
      );
  }



  openEdit(itemlist) {
    // this.currentDbguid=itemlist.DBGUID;
    this.InstanceDBGUID = itemlist.DBGUID;
    this.model.Name = itemlist.Tag;
    this.model.TagName = itemlist.Tag;
    this.model.ServIS_Id = itemlist.ServISId;
    this.model.SchedType = itemlist.Type;
    this.model.SchedValue = itemlist.Value;
    this.model.SchedTime = itemlist.Time;
    this.isEdit = true;
    this.onOptionSelected(this.model.SchedType, this.model.SchedValue);
    //this.editalramdetails(itemlist);
    if(itemlist.Tag !="")
    {
      let editalm = this._FetchAlramdetails.filter(x => { return x.Dbguid == itemlist.DBGUID });
      if(editalm.length !=0)
      {
        this.model.LeadingEdge=(editalm[0].AlarmProperties[0].LeadingEdge).toString();
        this.model.TrailingEdge=(editalm[0].AlarmProperties[0].TrailingEdge).toString();
      }
      
    }
    
   
    this.dialogform.open();
    //this.getallalramvalues(itemlist);
    //console.log(this._FetchAlramdetails);

  }



  public postScheduleInfo(f:NgForm) {
    // if( this.SchedValue =='0') {
    const time = this._GlobalService.GetUTCTime(this.model.SchedTime);
    let day = parseInt(this.model.SchedValue);
    if (this.model.SchedType != 'DLY') {
      let dateTime = moment().set({ 'hour': parseInt(this.model.SchedTime.substr(0, 2)), 'minute': parseInt(this.model.SchedTime.substr(3, 2)) }).format('DD-MM-YYYY HH:mm');
      dateTime = this._GlobalService.GetUTCDateTime(dateTime);
      let newDate = moment(dateTime, 'DD-MM-YYYY').format('DD-MM-YYYY');
      let curDate = moment().format('DD-MM-YYYY');
      if (newDate < curDate) {
        switch (this.model.SchedType) {
          case 'WKL':
            if (day === 1)
              day = 7;
            else
              day -= 1;
            break;
          case 'MTL':
            if (day === 1)
              day = 27;
            else {

              day -= 1;
            }
            break;
        }
      }
      else if (newDate > curDate) {
        switch (this.model.SchedType) {
          case 'WKL':
            if (day === 7)
              day = 1;
            else
              day += 1;
            break;
          case 'MTL':
            if (day === 27)
              day = 1;
            else {
              day += 1;
            }
            break;
        }
      }
    }
    this.schedulerInfo = {
      'InstanceDBGUID': this.InstanceDBGUID,
      'Name': this.model.Name,
      'TagName': this.model.TagName,
      'ServIS_Id': this.model.ServIS_Id,
      'SchedType': this.model.SchedType,
      'SchedValue': day.toString(),
      'SchedTime': time,
      'CreatedBy': this._storageService.Session_UserInfo.Email.toString()
    };

    this.SchedulerAlramInfo={
      'Dbguid':this.InstanceDBGUID,
      'ExistingAlarmName':"Alarm",
      'LeadingEdge':Number(this.model.LeadingEdge) ,
      'TrailingEdge':Number(this.model.TrailingEdge) 
    }
       //console.log(this.SchedulerAlramInfo);
       //console.log(this.schedulerInfo);
    // }
      
      this.postScheduleNoParam(f);
  }
  public SetUTCOffSetValue(item: IVerificationHistory) {
    let time = this._GlobalService.SetUTCOffsetTime(item.Time);
 
    let day = parseInt(item.Value);
    if (item.Type != 'DLY') {
      let dateTime = moment().set({ 'hour': parseInt(time.substr(0, 2)), 'minute': parseInt(time.substr(3, 2)) }).format('DD-MM-YYYY HH:mm');
      dateTime = this._GlobalService.GetUTCDateTime(dateTime);
      let newDate = moment(dateTime, 'DD-MM-YYYY').format('DD-MM-YYYY');
      let curDate = moment().format('DD-MM-YYYY');
      if (newDate > curDate) {
        switch (item.Type) {
          case 'WKL':
            if (day === 1)
              day = 7;
            else
              day -= 1;
            break;
          case 'MTL':
            if (day === 1)
              day = 27;
            else
              day -= 1;
            break;
        }
      }
      else if (newDate < curDate) {
        switch (item.Type) {
          case 'WKL':
            if (day === 7)
              day = 1;
            else
              day += 1;
            break;
          case 'MTL':
            if (day === 27)
              day = 1;
            else
              day += 1;
            break;
        }
      }
    }
    item.Time = time;
    item.Value = day.toString();
    item.Time_Stamp = this._GlobalService.SetUTCOffsetDateTime(item.Time_Stamp)
    return item
  }
  // Delete Scheduler information with Confirmation
  public deleteSchedulerconfirm(InstanceDBGUID) {
    this.deleteDbguid = InstanceDBGUID;
    this.dialog.open();
  }

//method for updating alarm details
public updatealaramdetails()
{
this._schedulerService.UpdateScheduleralram(this.SchedulerAlramInfo).subscribe(data=>
  {console.log(data)},error => {
    this.toastr.error('Alarms cannot be configured for this device.', 'ERROR', {
      timeOut: 12000,
      
    });
    console.log('UserEmailID: ' + this._storageService.Session_UserInfo.Email + 'CreatedBy:' +
      this._storageService.Session_UserInfo.Email + 'Error: ' + error);
  }
  )}

  // Displaying detail in matcard
  public postScheduleNoParam(form:NgForm) {
    this.isEdit = false;

    this._schedulerService.postSchedule(this.schedulerInfo).subscribe(
      data => {
        console.log(data);
        this.updatealaramdetails();
        this.toastr.success('Schedule has been changed.', 'SUCCESS', {
          timeOut: 8000,
          extendedTimeOut:5000,
         
        });
        form.resetForm(form.value);
        this.getAllInstance();
        this.model.LeadingEdge=0;
        this.model.TrailingEdge=0;
        this.dialogform.close();

        //console.log(data);
      },
      error => {
        this.toastr.error('Something went wrong with schedule, please retry.', 'ERROR', {
          timeOut: 5000,
        });
        console.log('UserEmailID: ' + this._storageService.Session_UserInfo.Email + 'CreatedBy:' +
          this._storageService.Session_UserInfo.Email + 'Error: ' + error);
      }
    );
  }
  // deleting the schedule
  public deletSchedule() {

    this._schedulerService.deletSchedule(this.deleteDbguid, this._storageService.Session_UserInfo.Email).subscribe(
      data => {
        this.toastr.success('Schedule has been deleted.', 'SUCCESS', {
          timeOut: 5000,
        });
        //console.log(data);
        this.getAllInstance();
      },
      error => {
        console.log('UserEmailID: ' + this._storageService.Session_UserInfo.Email +
          ' CreatedBy: ' + this._storageService.Session_UserInfo.Email + error);
      }
    );
    
  }
}


interface Weekdaysinterface {
  dayname: String;
  value: Number;
}

export class formmodel {
  Name: string;
  TagName: string;
  ServIS_Id: string;
  SchedType: string;
  SchedValue: string;
  SchedTime: string;
  LeadingEdge: string;
  TrailingEdge: string;
}


