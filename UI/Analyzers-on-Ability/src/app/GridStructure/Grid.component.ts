import { IUserDetails } from './../Interfaces/IUserDetails';
import { SessionStorageService } from './../Services/SessionStorageService';
import { Component, ViewChild, ViewEncapsulation, OnInit, OnDestroy, AfterViewInit, ChangeDetectorRef, ElementRef } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { IgxGridComponent, IgxColumnComponent, SortingDirection } from 'igniteui-angular';
import { HomeService } from './../Services/HomeService';
import { UtilitySvc } from './../Services/UtilitySvc';
import { IVerificationHistory } from './../HomePage/IVerificationHistory';
import { saveAs } from 'file-saver';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { ToastrService } from 'ngx-toastr';
import { GlobalService } from '../Services/global.service';
//import{SessionStorageService}
import * as moment from 'moment';

enum TYPE{
  SINGLE="single",
  MULTI="multiple"
}


@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'GridComponent',

  templateUrl: 'Infragistix.component.html',
  styleUrls: ['Grid.component.css'],
})
export class GridComponent implements OnInit, AfterViewInit {
  @ViewChild('grid1') public grid1: IgxGridComponent;
  // public sortExpr = { fieldName: 'Date_Stamp,Last_Verification_Result,Time', dir: SortingDirection.Asc };
  @ViewChild('btnHdn') btnHidden: ElementRef;
  public currentSortingType: TYPE = TYPE.SINGLE;
  public usersessionList: IUserDetails;
  public data: any[];
  public _verificationHistoryList: IVerificationHistory[] = [];
  //public Dateformat: any;
  refreshCount: number = 0;
  responseList: any[];

  public _abilityDeviceGUIDList: any[] = [];

  public _filteredVerificationHistoryList: IVerificationHistory[] = [];

  public month: number = (new Date().getMonth()) + 1;
  public week: number = 1;
  public year: number = new Date().getFullYear();
  public LoggedInUser: IUserDetails;
  noOfDevices: number = 0;

  public _year: number[] = [];
  public i: number;
  constructor(private httpService: HttpClient, private cdr: ChangeDetectorRef, private _HomeService: HomeService, private ng4Spinner: Ng4LoadingSpinnerService,
    private _UtilitySvc: UtilitySvc, private _storageService: SessionStorageService, private toastr: ToastrService,
    public _GlobalService: GlobalService) {
    this.getWeek();
    for (this.i = this.year -2; this.i <= this.year + 1; this.i++ ) {
      this._year.push(this.i);
    }
    this.LoggedInUser = this._storageService.Session_UserInfo;
  }


  //implementing single sorting in grid
  public removeSorting($event) {
    if (this.currentSortingType === TYPE.SINGLE) {
        this.grid1.columns.forEach((col) => {
            if (!(col.field === $event.fieldName)) {
                this.grid1.clearSort(col.field);
            }
        });
    }
}

  ngOnInit(): void {
    this.grid1.sortingExpressions = [
      {
        dir: SortingDirection.Desc, fieldName: "Date_Stamp",
        ignoreCase: true
      }
      // { fieldName: 'Time', dir: SortingDirection.Desc }
      // { fieldName: 'Time', dir: SortingDirection.Desc }
    ];
    this.ng4Spinner.show();
    this.getAssignedAbilityGUID();
    // this.grid1.sortingExpressions = [this.sortExpr];
    this.ng4Spinner.hide();
  };
  public ngAfterViewInit() {
    this.ng4Spinner.show();

    // this.grid1.onSortingDone.subscribe((expr) => {
    //   if (expr.dir === SortingDirection.None) {
    //     this.grid1.sort({ fieldName: 'Date_Stamp,Last_Verification_Result,Time', dir: SortingDirection.Asc });

    //     this.ng4Spinner.hide();
    //   }
    // });
    // let pagenumber = this.grid1.totalPages;
    this.ng4Spinner.hide();
  }

  public getIconType(cell) {
    switch (cell.row.rowData.Position) {
      case 'up':
        return 'arrow_upward';
      case 'current':
        return 'arrow_forward';
      case 'down':
        return 'arrow_downward';
    }
  }


   //Lists all the DBGUIDs in the system
  public getAssignedAbilityGUID() {
    this.ng4Spinner.show();
    this._HomeService.getAssignedAbilityGUID(this._storageService.Session_UserInfo.Email,
      this._storageService.Session_UserInfo.Email).
      subscribe(
        data => {
          // setTimeout(()=>{ 

          this._abilityDeviceGUIDList = data as string[];

          this.noOfDevices = this._abilityDeviceGUIDList.length;

          for (let result of this._abilityDeviceGUIDList) {
            this.getVerificationHistory(result);
          }
          setTimeout(() => {
            // this.initiateFilterVerificationList();
            this.cdr.detectChanges();
            this.ng4Spinner.hide();
          }, 1000);

          // }, 6000)
        },
        error => {
          this.ng4Spinner.hide();
          console.log('UserEmailID: ' + this._storageService.Session_UserInfo.Email +
            ' CreatedBy: ' + this._storageService.Session_UserInfo.Email + ' Error: ' + error);
        }
      );
  }


   //Lists all the DBGUIDs in the system
  public getVerificationHistory(dbGUID: string) {
    this.ng4Spinner.show();
    this._UtilitySvc.getVerificationHistory(dbGUID, this._storageService.Session_UserInfo.Email,
      this._storageService.Session_UserInfo.Email).
      subscribe(
        data => {
           // setTimeout(()=>{ 

          let tempVerficationhistoryList: IVerificationHistory[] = data;
          for (let _vHistory of tempVerficationhistoryList) {
            this._verificationHistoryList.push(_vHistory);
          }
          this.noOfDevices--;
          // }, 6000)
          if (this.noOfDevices == 0) {
            this.initiateFilterVerificationList();
          }
          this.ng4Spinner.hide();
        },
        error => {
          this.ng4Spinner.hide();
          console.log('UserEmailID: ' + this._storageService.Session_UserInfo.Email +
            ' CreatedBy: ' + this._storageService.Session_UserInfo.Email + ' Error: ' + error);
        }
      );
  }

  public initiateFilterVerificationList() 
  { //: IVerificationHistory[]
  this.grid1.paging = true;
  this.grid1.paginate(0);
    if (this._filteredVerificationHistoryList.length > 0) {
      this.grid1.paginate(0);
    }
    else {
      this.grid1.paging = false;
    }
    this.grid1.paging = true;
    let weekNumber: number = this.week, month: number = this.month, year: number = this.year;
    let noOfWeeks: number = this.numberOfWeeks(year, month);
    let firstDate = new Date(year, month - 1, 1);
    let lastDate = new Date(year, month, 0);
    this._filteredVerificationHistoryList = this.filterVerificationHistoryList(weekNumber, lastDate.getDate(), firstDate.getDay(), noOfWeeks, month, year);
    setTimeout(() => {
      if (length == 0 && this.grid1.data.length > 0) {
        if (this.refreshCount < 1) {
          this.refreshCount += 1;
          let btnElement: HTMLElement = this.btnHidden.nativeElement as HTMLElement;
          btnElement.click();
        }
        else
          this.refreshCount = 0;
      }
    }, 1)
  }

// calucalting number weeks, months present in a year
  public numberOfWeeks(year, month): number {

    let firstDate = new Date(year, month - 1, 1);
    let lastDate = new Date(year, month, 0);
    let daysCount = firstDate.getDay() + lastDate.getDate();
    return Math.ceil(daysCount / 7);
  }

  public getWeek() {
    let currentDate = new Date();
    let datenumber = currentDate.getDate();

    let firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();


    let weekOne: number = 7 - firstDay;
    let weekOneStartDate: number = 1;
    let weekOneEndDate: number = weekOne;
    let weekTwoStartDate: number = (weekOne + 1)
    let weekTwoEndDate: number = weekTwoStartDate + 6;

    // let weekTwoEndDate: number = weekTwoStartDate + 6;
    let weekThreeStartDate: number = (weekTwoEndDate + 1);
    let weekThreeEndDate: number = (weekThreeStartDate + 6);
    let weekFourStartDate: number = (weekThreeEndDate + 1);
    let weekFourEndDate: number = (weekFourStartDate + 6);
    let weekFiveStartDate: number = (weekFourEndDate + 1);
    let weekFiveEndDate: number = (weekFiveStartDate + 6);
    let weekSixStartDate: number = (weekFiveEndDate + 1);
    let weekSixEndDate: number = (weekSixStartDate + 6);

    if (currentDate.getDate() <= weekOneEndDate) {
      this.week = 1;
    }
    else if (currentDate.getDate() > weekOneEndDate && currentDate.getDate() <= weekTwoEndDate) {
      this.week = 2;
    }
    else if (currentDate.getDate() > weekTwoEndDate && currentDate.getDate() <= weekThreeEndDate) {
      this.week = 3;
    }
    else if (currentDate.getDate() > weekThreeEndDate && currentDate.getDate() <= weekFourEndDate) {
      this.week = 4;
    }
    else if (currentDate.getDate() > weekFourEndDate && currentDate.getDate() <= weekFiveEndDate) {
      this.week = 5;
    }
    else {
      this.week = 6;
    }
  


  }

  public filterVerificationHistoryList(weekNumber, daysInMonth, firstDay: number, noOfWeeks: number, month: number, year: number): IVerificationHistory[] {
    let weekOne: number = 7 - firstDay;
    let weekOneStartDate: number = 1;
    let weekOneEndDate: number = weekOne;
    let weekTwoStartDate: number = (weekOne + 1)
    let weekTwoEndDate: number = weekTwoStartDate + 6;

    // let weekTwoEndDate: number = weekTwoStartDate + 6;
    let weekThreeStartDate: number = (weekTwoEndDate + 1);
    let weekThreeEndDate: number = (weekThreeStartDate + 6);
    let weekFourStartDate: number = (weekThreeEndDate + 1);
    let weekFourEndDate: number = (weekFourStartDate + 6);
    let weekFiveStartDate: number;
    let weekFiveEndDate: number;
    let weekSixStartDate: number;
    let weekSixEndDate: number;

    let verificationHistoryList: IVerificationHistory[];
    if (noOfWeeks > 4) {
      weekFiveStartDate = (weekFourEndDate + 1)
      let remainingDays = daysInMonth - weekFourEndDate;
      if (remainingDays > 6) {
        weekFiveEndDate = (weekFiveStartDate + 6);
      }
      else {
        weekFiveEndDate = daysInMonth;
      }
      if (noOfWeeks == 6) {
        weekSixStartDate = (weekFiveEndDate + 1);
        weekSixEndDate = daysInMonth;
      }
    }
    let tempVerificationHistoryCollection: IVerificationHistory[] = this._verificationHistoryList;
    if (weekNumber == 1) {

      let sDate = new Date(year, month - 1, weekOneStartDate, 0, 0, 0, 0);
      const eDate = new Date(year, month - 1, weekOneEndDate, 23, 59, 59, 0);


      return tempVerificationHistoryCollection.filter((item: IVerificationHistory) => {
        if (item.Time_Stamp.toString().length > 0) {
          const dateTimeStamp = this._GlobalService.SetUTCOffsetDateTime(item.Time_Stamp);
          const dateParts = dateTimeStamp.toString().split(' ');
          const datearray = dateParts[0].split('-');
          const timeArray = dateParts[1].split(':');
          const dateObject = new Date(parseInt(datearray[2]), parseInt(datearray[1]) - 1, parseInt(datearray[0]), parseInt(timeArray[0]),
            parseInt(timeArray[1]), parseInt(timeArray[2]));
          item.Date_Stamp = datearray[2] + '-' + datearray[1] + '-' + parseInt(datearray[0]);
          item.Date_Stamp=moment(item.Date_Stamp).format('YYYY-MM-DD');
          item.Time = timeArray[0] + ':' + timeArray[1];
          if (dateObject > sDate && dateObject < eDate) {
            return tempVerificationHistoryCollection;
          }
        }
      });
    }
    else if (weekNumber == 2) {
      let sDate = new Date(year, month - 1, weekTwoStartDate, 0, 0, 0, 0);
      const eDate = new Date(year, month - 1, weekTwoEndDate, 23, 59, 59, 0);
      return tempVerificationHistoryCollection.filter((item: IVerificationHistory) => {
        if (item.Time_Stamp.toString().length > 0) {

          const dateTimeStamp = this._GlobalService.SetUTCOffsetDateTime(item.Time_Stamp);
          let dateParts = dateTimeStamp.toString().split(' ');
          let datearray = dateParts[0].split('-');
          let timeArray = dateParts[1].split(':');
          let dateObject = new Date(parseInt(datearray[2]), parseInt(datearray[1]) - 1, parseInt(datearray[0]), parseInt(timeArray[0]),
            parseInt(timeArray[1]), parseInt(timeArray[2]));
          item.Date_Stamp = datearray[2] + '-' + datearray[1] + '-' + parseInt(datearray[0]);
          item.Date_Stamp=moment(item.Date_Stamp).format('YYYY-MM-DD');
          item.Time = timeArray[0] + ':' + timeArray[1];
          if (dateObject > sDate && dateObject < eDate) {
            return tempVerificationHistoryCollection;
          }
        }
      });

    }
    else if (weekNumber == 3) {
      let sDate = new Date(year, month - 1, weekThreeStartDate, 0, 0, 0, 0);
      let eDate = new Date(year, month - 1, weekThreeEndDate, 23, 59, 59, 0);
      return tempVerificationHistoryCollection.filter((item: IVerificationHistory) => {
        if (item.Time_Stamp.toString().length > 0) {

          let dateTimeStamp = this._GlobalService.SetUTCOffsetDateTime(item.Time_Stamp);
          let dateParts = dateTimeStamp.toString().split(' ');
          let datearray = dateParts[0].split('-');
          let timeArray = dateParts[1].split(':');
          let dateObject = new Date(parseInt(datearray[2]), parseInt(datearray[1]) - 1, parseInt(datearray[0]), parseInt(timeArray[0]),
            parseInt(timeArray[1]), parseInt(timeArray[2]));
          item.Date_Stamp = datearray[2] + '-' + datearray[1] + '-' + parseInt(datearray[0]);
          item.Date_Stamp=moment(item.Date_Stamp).format('YYYY-MM-DD');
          item.Time = timeArray[0] + ':' + timeArray[1];
          if (dateObject > sDate && dateObject < eDate) {
            return tempVerificationHistoryCollection;
          }
        }
      });
    }
    else if (weekNumber == 4) {
      let sDate = new Date(year, month - 1, weekFourStartDate, 0, 0, 0, 0);
      let eDate = new Date(year, month - 1, weekFourEndDate, 23, 59, 59, 0);
      return tempVerificationHistoryCollection.filter((item: IVerificationHistory) => {
        if (item.Time_Stamp.toString().length > 0) {

          let dateTimeStamp = this._GlobalService.SetUTCOffsetDateTime(item.Time_Stamp);
          let dateParts = dateTimeStamp.toString().split(' ');
          let datearray = dateParts[0].split('-');
          let timeArray = dateParts[1].split(':');
          let dateObject = new Date(parseInt(datearray[2]), parseInt(datearray[1]) - 1, parseInt(datearray[0]), parseInt(timeArray[0]),
            parseInt(timeArray[1]), parseInt(timeArray[2]));
          item.Date_Stamp = datearray[2] + '-' + datearray[1] + '-' + datearray[0];
          item.Date_Stamp=moment(item.Date_Stamp).format('YYYY-MM-DD');
          item.Time = timeArray[0] + ':' + timeArray[1];
          if (dateObject > sDate && dateObject < eDate) {
            return tempVerificationHistoryCollection;
          }
        }
      });
    }
    else if (weekNumber == 5) {
      const sDate = new Date(year, month - 1, weekFiveStartDate, 0, 0, 0, 0);
      let eDate = new Date(year, month - 1, weekFiveEndDate, 23, 59, 59, 0);
      return tempVerificationHistoryCollection.filter((item: IVerificationHistory) => {
        if (item.Time_Stamp.toString().length > 0) {

          let dateTimeStamp = this._GlobalService.SetUTCOffsetDateTime(item.Time_Stamp);
          let dateParts = dateTimeStamp.toString().split(' ');
          let datearray = dateParts[0].split('-');
          let timeArray = dateParts[1].split(':');
          let dateObject = new Date(parseInt(datearray[2]), parseInt(datearray[1]) - 1, parseInt(datearray[0]), parseInt(timeArray[0]),
            parseInt(timeArray[1]), parseInt(timeArray[2]));
          item.Date_Stamp = datearray[2] + '-' + datearray[1] + '-' + parseInt(datearray[0]);
          item.Date_Stamp=moment(item.Date_Stamp).format('YYYY-MM-DD');
          item.Time = timeArray[0] + ':' + timeArray[1];
          if (dateObject > sDate && dateObject < eDate) {
            return tempVerificationHistoryCollection;
          }
        }
      });

    }
    else if (weekNumber == 6) {
      const sDate = new Date(year, month - 1, weekSixStartDate, 0, 0, 0, 0);
      let eDate = new Date(year, month - 1, weekSixEndDate, 23, 59, 59, 0);
      return tempVerificationHistoryCollection.filter((item: IVerificationHistory) => {
        if (item.Time_Stamp.toString().length > 0) {

          let dateTimeStamp = this._GlobalService.SetUTCOffsetDateTime(item.Time_Stamp);
          let dateParts = dateTimeStamp.toString().split(' ');
          const datearray = dateParts[0].split('-');
          const timeArray = dateParts[1].split(':');
          const dateObject = new Date(parseInt(datearray[2]), parseInt(datearray[1]) - 1, parseInt(datearray[0]), parseInt(timeArray[0]),
            parseInt(timeArray[1]), parseInt(timeArray[2]));
          item.Date_Stamp = datearray[2] + '-' + datearray[1] + '-' + parseInt(datearray[0]);
          item.Date_Stamp=moment(item.Date_Stamp).format('YYYY-MM-DD');
          item.Time = timeArray[0] + ':' + timeArray[1];
          if (dateObject > sDate && dateObject < eDate) {
            return tempVerificationHistoryCollection;
          }
        }
      });
    }

    return [];
  }



  public getVerificationResult(verificationResultId: number, userEmailId: string, createdBy: string) {
    // this.downloadLatest_status = true;
    this.toastr.info('Download in progress, please wait.', 'INFO', {
      timeOut: 3000,
    });
    this.ng4Spinner.show();
    let result: IVerificationHistory[];
    result = this._filteredVerificationHistoryList.filter((item: IVerificationHistory) => {
      const pDate = new Date(item.Time_Stamp);
      if (item.ResultVerificationId === verificationResultId) {

        this.ng4Spinner.hide();
        return this._filteredVerificationHistoryList[0];
      }
    });

    // alert(result[0].Time_Stamp);

    this._UtilitySvc.getVerificationResult(verificationResultId, userEmailId, createdBy).
      subscribe(
        response => {

          if (response == null || response.status === 204)
            this.toastr.error('Report is not available.', 'ERROR', {
              timeOut: 5000,
            });

          else {
            let blob = new Blob([response], { type: 'application/pdf' });
            const filename = result[0].Time_Stamp + '_report.pdf';
            this.toastr.success('Report has been downloaded.', 'SUCCESS', {
              timeOut: 5000,
            });

            saveAs(blob, filename);

          }
          this.ng4Spinner.hide();


        },
        error => {
          this.toastr.error('Report download failed.', 'ERROR', {
            timeOut: 5000,
          });
          this.ng4Spinner.hide();
          console.log('UserEmailID: ' + 'sanoob.husain@in.abb.com' + ' CreatedBy: ' +
            'sanoob.husain@in.abb.com' + ' Error: ' + error);
        }
      );
  }

}


