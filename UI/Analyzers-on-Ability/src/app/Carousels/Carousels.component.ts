import { SessionStorageService } from './../Services/SessionStorageService';
import { Component, OnInit, ViewChild, ViewChildren, ViewEncapsulation } from '@angular/core';
import { IgxCarouselComponent } from 'igniteui-angular';
import { HomeService } from './../Services/HomeService';
import { saveAs } from 'file-saver';
import { IndividualDeviceSvc } from './../Services/IndividualDeviceSvc';
import { UtilitySvc } from './../Services/UtilitySvc';
import { map } from 'rxjs/operators';
import { IUserDetails } from '../Interfaces/IUserDetails';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';

import { parse } from 'querystring';
import { IVerificationHistory } from '../HomePage/IVerificationHistory';
import { ToastrService } from 'ngx-toastr';
import { GlobalService } from '../Services/global.service';
@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'CarouselComponent',
  styleUrls: ['Carousels.component.css'],
  templateUrl: 'Carousel.component.html'
})
export class CarouselComponent implements OnInit {
  @ViewChild('carousel') public carousel: IgxCarouselComponent;
  public slides: any[] = [];
  public loop = true;
  public pause = true;
  public total: number;
  public current: number;
  public navigation: true;
  public Email: string;
  public usersessionList: IUserDetails;

  constructor(private _HomeService: HomeService, private ng4Spinner: Ng4LoadingSpinnerService, public _GlobalService: GlobalService,
    private _individualDeviceSvc: IndividualDeviceSvc, private _UtilitySvc: UtilitySvc, private _storageService: SessionStorageService, private toastr: ToastrService) {
  }

  public ngOnInit() {

    this.ng4Spinner.show();
    this.getAllInstance();
    this.addNewSlide();
    this.carousel.stop();
    this.total = this.slides.length;
    this.current = this.carousel.current;
    this.usersessionList = this._storageService.Session_UserInfo;
    this.ng4Spinner.hide();
  }

  public _deviceInstanceList: IVerificationHistory[] = [];

  // public SetUTCOffset(utcTime): string {
  //   return this._GlobalService.SetUTCOffset(utcTime);
  // }

  public getAllInstance() {
    this.ng4Spinner.show();
    this._deviceInstanceList = [];
     //console.log(this._storageService);
    this._HomeService.getAllInstance(this._storageService.Session_UserInfo.Email,
      this._storageService.Session_UserInfo.Email).subscribe(
        data => {
          //         var today = new Date();
          // var h = today.getHours();
          // var m = today.getMinutes();
          // var s = today.getSeconds();
          //         console.log(s);
          setTimeout(() => {
            this._deviceInstanceList = data as any[];
            this._deviceInstanceList.forEach(element => {
              element.Time_Stamp = this._GlobalService.SetUTCOffsetDateTime(element.Time_Stamp);
              element.Time = this._GlobalService.SetUTCOffsetTime(element.Time);
            });
            this.ng4Spinner.hide();
          }, 1000);
        },
        error => {
          this.ng4Spinner.hide();
          console.log('UserEmailID: ' + this._storageService.Session_UserInfo.Email +
            ' CreatedBy: ' + this._storageService.Session_UserInfo.Email + ' Error: ' + error);
        }
      );
  
  }

  public getVerificationResult(verificationResultId: number, userEmailId: string, createdBy: string) {
    this.toastr.info('Download in progress, please wait.', 'INFO', {
      timeOut: 3000,
    });
    this.ng4Spinner.show();
    let result: IVerificationHistory[];
    result = this._deviceInstanceList.filter((item: IVerificationHistory) => {
      const pDate = new Date(item.Time_Stamp);
      if (item.ResultVerificationId === verificationResultId) {
        this.ng4Spinner.hide();
        return this._deviceInstanceList[0];
      }
    });


    this._UtilitySvc.getVerificationResult(verificationResultId, userEmailId, createdBy).
      subscribe(
        response => {

          if (response == null || response.status === 204) {
            this.toastr.error('Report is not available.', 'ERROR', {
              timeOut: 5000,
            });
          }
          else {

            let blob = new Blob([response], { type: 'application/pdf' });
            let filename = result[0].Time_Stamp + '_report.pdf';
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
          console.log('UserEmailID: ' + userEmailId + ' CreatedBy: '
            + createdBy + ' Error: ' + error);
        }

      );
  }


  public addNewSlide() {

    this._deviceInstanceList;
  }

  public onSlideChanged(carousel: IgxCarouselComponent) {
    this.current = carousel.current + 1;

  }

  public pushVerificationDataFromHomePage(verificaitonHistory: IVerificationHistory) {
    this._individualDeviceSvc.pushVerificationDataFromHomePage(verificaitonHistory);
  }
}
