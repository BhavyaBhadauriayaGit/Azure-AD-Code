import { SessionStorageService } from './../Services/SessionStorageService';
import { Component } from '@angular/core';
import { LastVerificationSummary } from './LastVerificationSummary';
import { HomeService } from './../Services/HomeService';
  //import{SessionStorageService}

@Component({
  selector: 'DoughnutChartDemoComponent',
  templateUrl: 'Chart.component.html',
  styleUrls: ['Charts.component.css']
})

export class DoughnutChartDemoComponent {
  public doughnutChartData: any[] = [];
  public _lastverificationSummary: any[] = [];
  loaded = false;
  constructor(private _HomeService: HomeService, private _storageService: SessionStorageService) { }

  public ngOnInit() {
    this.lastVerificationSummary();
  }


  public lastVerificationSummary() {
    this.doughnutChartData = [];
    this._HomeService.lastVerificationSummary(this._storageService.Session_UserInfo.Email,
      this._storageService.Session_UserInfo.Email).subscribe(
        data => {
          setTimeout(() => {
          this._lastverificationSummary = data as any[];

          const d1 = this._lastverificationSummary.map(item => item.InstanceNo);

          this.doughnutChartData[0] = d1;
          this.loaded = true;
          }, 1000);
        }
        ,
        error => {
          console.log('UserEmailID: ' + 'sanoob.husain@in.abb.com' + ' CreatedBy: ' + 'sanoob.husain@in.abb.com' + ' Error: ' + error);
        }
      );
  }

   // Doughnut
  public doughnutChartLabels: Array<string> = ['Passed', 'Incomplete', 'Failed', 'Warning'];



  public doughnutChartType: string = 'doughnut';

  public doughnutChartOptions: any = {



    legend:
    {
      position: 'right',
      top: 50,
      padding: 30,

      labels: {
        usePointStyle: true,
        fontColor: '#D2D2D2',
        defaultFontFamily: 'ABBvoice',
        defaultFontSize: 14,


      }

    },
    options: {
      responsive: true,
      maintainAspectRatio: false
    }
  }
  public doughnutChartcolor: Array<any> = [
    {

      backgroundColor: [
        '#008000',
        '#808080',
        '#FF0000',
        '#FF8C00'
      ],
      borderColor: [
        '#008000',
        '#808080',
        '#FF0000',
        '#FF8C00'
      ],
      borderWidth: [
        0, 0, 0, 0
      ],
      hoverBackgroundColor: [
        '#008000',
        '#808080',
        '#FF0000',
        '#FF8C00'
      ],
      hoverBorderWidth: [
        3,
        3,
        3,
        3
      ]
    }];

   // events
  public chartClicked(e: any): void {
    console.log(e);
  }

  public chartHovered(e: any): void {
    console.log(e);
  }

}
