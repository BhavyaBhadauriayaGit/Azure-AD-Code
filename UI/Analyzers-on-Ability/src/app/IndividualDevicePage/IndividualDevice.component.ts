import { environment } from './../../environments/environment';
//To be included in Main Branch

import { SessionStorageService } from './../Services/SessionStorageService';
import { Component, OnInit, AfterViewInit, AfterViewChecked, ViewChild, HostBinding } from '@angular/core';
import { IndividualDeviceSvc } from './../Services/IndividualDeviceSvc';
import { IVerificationHistory } from './../HomePage/IVerificationHistory';
import { HttpClient } from '@angular/common/http';
import { UtilitySvc } from './../Services/UtilitySvc';
import { saveAs } from 'file-saver';
import { from } from 'rxjs';
import { groupBy, mergeMap, toArray } from 'rxjs/operators';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { IgxCalendarComponent } from 'igniteui-angular';
import { observable } from 'rxjs';
import { Searchfilterpipe } from '../SchedulerPage/SearchFilter.pipe';
import { isNumber } from 'util';
import { IUserDetails } from '../Interfaces/IUserDetails';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { ToastrService } from 'ngx-toastr';
import { UserDataProvider } from '../Provider/userDetail_Data.provider';
import { IgxGridComponent, IgxColumnComponent, SortingDirection } from 'igniteui-angular';
import { Router } from '@angular/router';
import { AppComponent } from '../app.component';
import { GlobalService } from '../Services/global.service';
import * as moment from 'moment';


enum TYPE{
  SINGLE='single',
  MULTI='multiple'
}

@Component({
  selector: 'IndividualDevice',
  templateUrl: 'IndividualDevice.component.html',
  styleUrls: ['IndividualDevice.component.css', './../HomePage/HomePage.component.css'],   // ,'Calendar.scss'
  providers: [Searchfilterpipe]
})
export class IndividualDeviceComponent implements OnInit, AfterViewInit, AfterViewChecked {
  public Title:string=environment.Title;
  @ViewChild('calendar') public calendar: IgxCalendarComponent;
  @ViewChild('grid1') public grid1: IgxGridComponent;
  @HostBinding('class')
  public colorSet = 'white-color-attr';
  public carouselVerificationHistory: IVerificationHistory;
  public _gridFilterData: IVerificationHistory[] = [];
  public _verificationHistoryList: IVerificationHistory[] = [];
  public _isGetInstanceReport: string;
  public formatViews: any;
  public LoggedInUser: IUserDetails;
  public groupdata: any = [];
  public counter_calendar_selection = false;
  public finaldatastatus: Array<{ Date_stamp: string, status_col: string }> = [];
  public select: HTMLSelectElement;
  public downloadLatest_status = false;
  public createNew_status = false;
  public dateTimeStamp: any;
  public currentSortingType: TYPE = TYPE.SINGLE;
  public RESULTID:any;
  public IDELastVerficationResult:any;

  constructor(private searchFilter: Searchfilterpipe, private _individualDeviceSvc: IndividualDeviceSvc, public _GlobalService: GlobalService,
    private ng4Spinner: Ng4LoadingSpinnerService, private toastr: ToastrService, private btn_createReport_status: UserDataProvider,
    private _UtilitySvc: UtilitySvc, private httpService: HttpClient, private _storageService: SessionStorageService,
    private router: Router, private appComponent: AppComponent) {
     // this.Loadgrid_OnClickedDate('');

    if (this._storageService.Session_UserInfo) {
      if (this._storageService.Session_UserInfo.IsDefaultUser) {
        this.router.navigate(['/ResetPass']);
      }
      if (this._storageService.Session_UserInfo.IsAbbEmail) {
        this.router.navigate(['/Password']);
      }
    } else {
      this._storageService.clearSession();
    //  this.router.navigate(['/Login']);
    }
    this.pushVerificationDataFromHomePage();
    this.getVerificationHistory(this.carouselVerificationHistory.DBGUID);
    this.LoggedInUser = this._storageService.Session_UserInfo;
    if (this.btn_createReport_status._createNew_status) {
      this.createNew_status = this.btn_createReport_status._createNew_status;
    } else {
      this.btn_createReport_status._createNew_status = this.createNew_status;
    }

    appComponent.ngIdleImplementation();
  }


  public removeSorting($event) {
    if (this.currentSortingType === TYPE.SINGLE) {
        this.grid1.columns.forEach((col) => {
            if (!(col.field === $event.fieldName)) {
                this.grid1.clearSort(col.field);
            }
        });
    }
}
  public dates: Date[] = [];
  ngOnInit() {
    // if(this.IDELastVerficationResult === '' && this.RESULTID === ''){
    //   this.downloadLatest_status = false;
    // }
    // this.Loadgrid_OnClickedDate('');

    this.grid1.sortingExpressions = [
      {
        dir: SortingDirection.Desc, fieldName: 'Date_Stamp',
        ignoreCase: true
      }
      // { fieldName: 'Time', dir: SortingDirection.Desc }
      // { fieldName: 'Time', dir: SortingDirection.Desc }
    ];


    this.Loadgrid_OnClickedDate('');

    this.formatViews = { day: false, month: true, year: true };
     // setTimeout(() => {
    this._verificationHistoryList = this._verificationHistoryList.filter((data: IVerificationHistory) => {
      return data;
    });
    let todaymonth: string;
    if ((new Date().getUTCMonth() + 1) < 10) {
      todaymonth = '0' + (new Date().getUTCMonth() + 1).toString();
    } else {
      todaymonth = (new Date().getUTCMonth() + 1).toString();
    }
    this._gridFilterData = this._verificationHistoryList.filter(item => {

      if (item.Date_Stamp.split('-')[1] === todaymonth) {
        return item;
      }
    });
    //console.log(this._verificationHistoryList);;
    //}, 1);

  }

  ngOnDestroy() {
    this.appComponent.resetTimeOut();

  }
  ngAfterViewInit() {
    this.ng4Spinner.show();
    this.calendar.selection = 'multi';
    const disabledates = document.getElementsByClassName('igx-calendar__date--inactive');

    for (let disdate = 0; disdate < disabledates.length; disdate++) {
      disabledates[disdate].setAttribute('style', 'pointer-events: none !important;');
    }
    setTimeout(() => {
      if (this.finaldatastatus.length === 0) {
        this.getVerificationColorOutput();
        if (this.finaldatastatus.length > 0) {
          let highlightdates: any = [];
          highlightdates = this.finaldatastatus.map(item => item.Date_stamp);

          if (highlightdates.length > 0) {
            for (let i = 0; i < highlightdates.length; i++) {
              let splitdates: string[] = [];
              splitdates = highlightdates[i].split('-');
              this.dates.push(new Date(parseInt(splitdates[0], 0), parseInt(splitdates[1], 0) - 1, parseInt(splitdates[2], 0), 0, 0, 0, 0));
            }
          }
        }
      }
      this.calendar.selectDate(this.dates);
      this.ng4Spinner.hide();
    }, 1000);
  }

  ngAfterViewChecked() {
     //  setTimeout(() => {
    this.ng4Spinner.show();
    this.calendar.selection = 'multi';
    const result = document.getElementsByClassName('igx-calendar__date--selected');
    for (let sdate = 0; sdate < result.length; sdate++) {
      let MonthYear: string[] = [];
      MonthYear = (result[sdate].parentNode.parentNode.childNodes[0].childNodes[1].textContent).split(' ');
      this.finaldatastatus.forEach(item => {
        if (this.getMonthMapping((parseInt(item.Date_stamp.split('-')[1], 0) - 1).toString()) === MonthYear[1] &&
          MonthYear[3] === item.Date_stamp.split('-')[0]) {
          if (result[sdate]) {
            let date = item.Date_stamp.split('-')[2];
            date = date.indexOf('0') === 0 ? date.substr(1) : date;
            if (result[sdate].innerHTML.toString().trim() === date) {
              if (item.status_col === 'Green') {
                result[sdate].setAttribute('style', 'background-color: green');
                result[sdate].classList.remove('igx-calendar__date--selected');
                this.counter_calendar_selection = true;
              }
              if (item.status_col === 'Red') {
                result[sdate].setAttribute('style', 'background-color: red');
                result[sdate].classList.remove('igx-calendar__date--selected');
                this.counter_calendar_selection = true;
              }
              if (item.status_col === 'Orange') {
                result[sdate].setAttribute('style', 'background-color:orange');
                result[sdate].classList.remove('igx-calendar__date--selected');
                this.counter_calendar_selection = true;
              }
            }
          }
        }
      }

      );
    }
     // }
    this.ng4Spinner.hide();
     // }, 1);
  }

  public getMonthMapping(month): string {
    if (month === '0' || month === '00' || month === '-1') {
      return 'Jan';
    }
    if (month === '01' || month === '1') {
      return 'Feb';
    }
    if (month === '02' || month === '2') {
      return 'Mar';
    }
    if (month === '03' || month === '3') {
      return 'Apr';
    }
    if (month === '04' || month === '4') {
      return 'May';
    }
    if (month === '05' || month === '5') {
      return 'Jun';
    }
    if (month === '06' || month === '6') {
      return 'Jul';
    }
    if (month === '07' || month === '7') {
      return 'Aug';
    }
    if (month === '08' || month === '8') {
      return 'Sep';
    }
    if (month === '09' || month === '9') {
      return 'Oct';
    }
    if (month === '10') {
      return 'Nov';
    }
    if (month === '11') {
      return 'Dec';
    }
  }

  public Loadgrid_OnClickedDate(selected_dates: any) {
    this.grid1.paging = true;
    this.grid1.paginate(0);
    this.ng4Spinner.show();
    this._gridFilterData = [];
    const months = new Array(12);
    months[1] = 'Jan';
    months[2] = 'Feb';
    months[3] = 'Mar';
    months[4] = 'Apr';
    months[5] = 'May';
    months[6] = 'Jun';
    months[7] = 'Jul';
    months[8] = 'Aug';
    months[9] = 'Sep';
    months[10] = 'Oct';
    months[11] = 'Nov';
    months[12] = 'Dec';

    //console.log(selected_dates);
    let clicked_header: string = '';
    clicked_header = selected_dates.srcElement.innerText.toString();
    if (clicked_header === 'keyboard_arrow_left') {
      this.calendar.selection = 'single';
      this.ngAfterViewInit();
      this.ngAfterViewChecked();
      let MonthYear: string[] = [];
      MonthYear = (selected_dates.srcElement.parentNode.parentNode.childNodes[1].textContent).split(' ');
      //console.log('left:', MonthYear[1]);
      let selectedMonth: string;
      selectedMonth = months.findIndex(item => item === MonthYear[1]).toString();
      if (Number(selectedMonth) < 10) {
        selectedMonth = '0' + selectedMonth.toString();
      }
      this._gridFilterData = this._verificationHistoryList.filter(item => {
        if ((item.Date_Stamp.split('-')[1] === selectedMonth.toString()) && (item.Date_Stamp.split('-')[0] === MonthYear[3])) {
          return item;
        }
      });
      this.ng4Spinner.hide();

    } else if (clicked_header === 'keyboard_arrow_right') {
      this.ng4Spinner.show();
      this.calendar.selection = 'single';
      this.ngAfterViewInit();
      this.ngAfterViewChecked();
      let MonthYear: string[] = [];
      MonthYear = (selected_dates.srcElement.parentNode.parentNode.childNodes[1].textContent).split(' ');
      //console.log('right:', MonthYear[3] + MonthYear[1]);
      let selectedMonth: string;
      selectedMonth = months.findIndex(item => item === MonthYear[1]).toString();
      if (Number(selectedMonth) < 10) {
        selectedMonth = '0' + selectedMonth.toString();
      }
      this._gridFilterData = this._verificationHistoryList.filter(item => {
        if ((item.Date_Stamp.split('-')[1] === selectedMonth.toString()) && (item.Date_Stamp.split('-')[0] === MonthYear[3])) {
          return item;
        }
      });
      this.ng4Spinner.hide();
    } else {
      this.ng4Spinner.show();
      let validateDate = false;
      const regexp = new RegExp('^[1-9][0-9]?$|^31$');
      validateDate = regexp.test(clicked_header);
      clicked_header = clicked_header.length === 1 ? '0' + clicked_header : clicked_header;
      if (validateDate) {
        let MonthYear: string[] = [];
        MonthYear = (selected_dates.srcElement.parentNode.parentNode.childNodes[0].childNodes[1].textContent).split(' ');
        let selectedDateMonth: string;
        selectedDateMonth = months.findIndex(item => item === MonthYear[1]).toString();
        //console.log(selectedDateMonth);
        if (Number(selectedDateMonth) < 10) {
          selectedDateMonth = '0' + selectedDateMonth;
        }
        this._gridFilterData = this._verificationHistoryList.filter(item => {
          if (item.Date_Stamp === (MonthYear[3] + '-' + selectedDateMonth + '-' + clicked_header)) {
           // console.log(item);
            return item;
          }
        });
        this.ng4Spinner.hide();
      }
    }


    if (this._gridFilterData.length > 0) {
      this.grid1.paginate(0);
    }
    else {
      this.grid1.paging = false;
    }


   // console.log(clicked_header);

  }

  public getVerificationColorOutput() {
    this.ng4Spinner.show();
    for (let i = 0; i < this._verificationHistoryList.length; i++) {
      let checkdateavaliable: any = [];
      let response: IVerificationHistory[] = [];
      let redstatus: IVerificationHistory[] = [];
      let greenstatus: IVerificationHistory[] = [];
      let orangestatus: IVerificationHistory[] = [];
      if (this.finaldatastatus.length === 0) {
        response = this._verificationHistoryList.filter(item => {
          if (this._verificationHistoryList[i].Date_Stamp === item.Date_Stamp) {
            return item;
          }
        });
        if (response.length !== 0) {
          redstatus = response.filter(item => {
            if (item.Last_Verification_Result === '3') {
              return item;
            }
          });
          if (redstatus.length !== 0) {
            if (redstatus.length > 0) {
              this.finaldatastatus.push({ Date_stamp: redstatus[0].Date_Stamp.toString(), status_col: 'Red' });
            }
          }
        //}
          else if (response.length !== 0) {
            orangestatus = response.filter(item => {
              if (item.Last_Verification_Result === '4') {
                return item;
              }
            });
            if (orangestatus.length !== 0) {
              if (orangestatus.length > 0) {
                this.finaldatastatus.push({ Date_stamp: orangestatus[0].Date_Stamp.toString(), status_col: 'Orange' });
              }
            }
         // }
          
          else {
            greenstatus = response.filter(item => {
              if (item.Last_Verification_Result === '1') {
                return item;
              }
            });
            if (greenstatus.length !== 0) {
              if (greenstatus.length > 0) {
                this.finaldatastatus.push({ Date_stamp: greenstatus[0].Date_Stamp.toString(), status_col: 'Green' });
              }
            }
          }
        }
        }
      }
      if (this.finaldatastatus.length > 0) {
        checkdateavaliable = this.finaldatastatus.filter(dateitem => {
          if (this._verificationHistoryList[i].Date_Stamp === dateitem.Date_stamp) {
            return dateitem;
          }
        });
        if (!(checkdateavaliable.length > 0)) {
          response = this._verificationHistoryList.filter(item => {
            if (this._verificationHistoryList[i].Date_Stamp === item.Date_Stamp) {
              return item;
            }
          });
          if (response.length !== 0) {
            redstatus = response.filter(item => {
              if (item.Last_Verification_Result === '3') {
                return item;
              }
            });
            if (redstatus.length !== 0) {
              if (redstatus.length > 0) {
                this.finaldatastatus.push({ Date_stamp: redstatus[0].Date_Stamp.toString(), status_col: 'Red' });
              }
            }
            else if(response.length !== 0)
            { orangestatus = response.filter(item => {
              if (item.Last_Verification_Result === '4') {
                return item;
              }
            });
            if (orangestatus.length !== 0) {
              if (orangestatus.length > 0) {
                this.finaldatastatus.push({ Date_stamp: orangestatus[0].Date_Stamp.toString(), status_col: 'Orange' });
              }
            }
         // }
           else {
              greenstatus = response.filter(item => {
                if (item.Last_Verification_Result === '1') {
                  return item;
                }
              });
              if (greenstatus.length !== 0) {
                if (greenstatus.length > 0) {
                  this.finaldatastatus.push({ Date_stamp: greenstatus[0].Date_Stamp.toString(), status_col: 'Green' });
                }
              }
            }
          }
        }
        }
      }
    }
    this.ng4Spinner.hide();

  }
  pushVerificationDataFromHomePage() {
    this.ng4Spinner.show();
    this.carouselVerificationHistory = this._individualDeviceSvc.getVerificationDataFromHomePage();
    this.ng4Spinner.hide();
  }


   // Lists all the DBGUIDs in the system
  public getVerificationHistory(dbGUID: string) {
    this.ng4Spinner.show();
    this._verificationHistoryList = [];
    this._UtilitySvc.getVerificationHistory(dbGUID, this._storageService.Session_UserInfo.Email,
      this._storageService.Session_UserInfo.Email).
      subscribe(
        data => {
          const tempVerficationhistoryList: IVerificationHistory[] = data;

          for (const _vHistory of tempVerficationhistoryList) {
            this.dateTimeStamp = this._GlobalService.SetUTCOffsetDateTime(_vHistory.Time_Stamp);
            //console.log(this.dateTimeStamp);
            const dateParts = this.dateTimeStamp.toString().split(' ');
            const datearray = dateParts[0].split('-');
            const timeArray = dateParts[1].split(':');
            const dateObject = new Date(parseInt(datearray[2]), parseInt(datearray[1]) - 1, parseInt(datearray[0]), parseInt(timeArray[0]),
              parseInt(timeArray[1]), parseInt(timeArray[2]));
            _vHistory.Date_Stamp = datearray[2] + '-' + datearray[1] + '-' + datearray[0];
            _vHistory.Time = timeArray[0] + ':' + timeArray[1];
             _vHistory.Date_Stamp = moment(_vHistory.Date_Stamp).format('YYYY-MM-DD');
            this.RESULTID= _vHistory.ResultVerificationId;
            this.IDELastVerficationResult=_vHistory.Last_Verification_Result;

            this._verificationHistoryList.push(_vHistory);


            this.ng4Spinner.hide();
          }

          setTimeout(() => {
            this.ng4Spinner.show();
            // if (this._verificationHistoryList.length == 0) {
            this.carouselVerificationHistory = this._individualDeviceSvc.getVerificationDataFromHomePage();
            //}
            //else {
            //this.carouselVerificationHistory = this._verificationHistoryList[this._verificationHistoryList.length - 1];
            // this.carouselVerificationHistory.Time = this._individualDeviceSvc.getVerificationDataFromHomePage().Time;
            //}
            this._verificationHistoryList = this._verificationHistoryList.filter((data: IVerificationHistory) => {
              this.ng4Spinner.hide();
              return data;
            });
            this._gridFilterData = this._verificationHistoryList;

            // for(var i=0;i<this._gridFilterData.length;i++){
            //   let newDateStamp=this._gridFilterData[i].Date_Stamp;
            //   let newGridDate=new Date(newDateStamp);
            //    let newDateobjDate=moment(newGridDate);
            //    let newformatDate=newDateobjDate.format('YYYY-MM-DD');
            //    var newDate = new Date();
            //    console.log(newDate);
            //  }

          }, 2000);



        },
        error => {
          this.ng4Spinner.hide();
          console.log('UserEmailID: ' + this._storageService.Session_UserInfo.Email + ' CreatedBy: ' +
            this._storageService.Session_UserInfo.Email + ' Error: ' + error);
        }
      );
  }

  public downloadreport() {
    alert('clicked');
  }


  public getVerificationResult(verificationResultId: number, userEmailId: string, createdBy: string, VerificationTimeStamp: string) {
  
    this.downloadLatest_status = true;
    this.toastr.info('Download in progress, please wait.', 'INFO', {
      timeOut: 3000,
    });
    this.ng4Spinner.show();
    this._UtilitySvc.getVerificationResult(verificationResultId, userEmailId, createdBy).
      subscribe(
        response => {

          if (response === null || response.status === 204) {
            this.toastr.error('Report is not available.', 'ERROR', {
              timeOut: 5000,
            });
          }
          else {
            const blob = new Blob([response], { type: 'application/pdf' });
            if (VerificationTimeStamp === undefined) {
              // VerificationTimeStamp = this.carouselVerificationHistory.Time_Stamp;
              VerificationTimeStamp = this.dateTimeStamp;
             // console.log(VerificationTimeStamp);
            }

            const filename = VerificationTimeStamp + '_report.pdf';
            this.toastr.success('Report has been downloaded.', 'SUCCESS', {
              timeOut: 5000,
            });
            saveAs(blob, filename);

          }
          this.ng4Spinner.hide();
          this.downloadLatest_status = false;
        },
        error => {
          this.toastr.error('Report download failed.', 'ERROR', {
            timeOut: 5000,
          });
          this.ng4Spinner.hide();
          console.log('UserEmailID: ' + this._storageService.Session_UserInfo.Email + ' CreatedBy: ' +
            this._storageService.Session_UserInfo.Email + ' Error: ' + error);

          this.downloadLatest_status = false;
        }

      );
  }

  public getInstanceReport(dbGUID: string, userEmailId: string) {

    this.createNew_status = true;
    this.btn_createReport_status._createNew_status = this.createNew_status;
    this.toastr.info('Generating report may take a few moments, please wait.', 'INFO', {
      timeOut: 6000,
    });
    this._individualDeviceSvc.getInstanceReport(dbGUID, userEmailId).
      subscribe(
        response => {


          this._isGetInstanceReport = response;
           // if (response.toString() === 'true') {
          this.toastr.success('Report generation completed!', 'SUCCESS', { timeOut: 6000 });
          this.getVerificationHistory(dbGUID);
          this.createNew_status = false;
          this.btn_createReport_status._createNew_status = this.createNew_status;


           // setTimeout(() => {
           //   this.ng4Spinner.show();
           //   this.getVerificationHistory(dbGUID);

           //   this.createNew_status = false;
           //   this.btn_createReport_status._createNew_status = this.createNew_status;
           //   this.ng4Spinner.hide();
           // }, 60000);
           //}
        },
        error => {
          //alert('in the component');
          this.getVerificationHistory(dbGUID);
          this.createNew_status = false;
          this.btn_createReport_status._createNew_status = this.createNew_status;
          this.toastr.info('Report will be generated in a moment.', 'INFO', {
            timeOut: 6000,
          });
        });
  }

}
