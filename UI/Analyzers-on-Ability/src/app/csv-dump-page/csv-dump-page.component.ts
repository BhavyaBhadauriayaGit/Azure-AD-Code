import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';

import { Router } from '@angular/router';
import { FormControl, NgModel} from '@angular/forms';
import { IgxExcelExporterService} from "igniteui-angular";
import { saveAs } from 'file-saver';
import { SessionStorageService } from './../Services/SessionStorageService';
import {CsvDumpService} from './../Services/csv-dump.service';
import { HomeService } from './../Services/HomeService';
import { IVerificationHistory } from './../HomePage/IVerificationHistory';
import { ICSVInfo} from '../Interfaces/icsvinfo';
import { GetAllinstances } from  '../Interfaces/get-allinstances';
import { DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { GlobalService } from '../Services/global.service';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import {SelectionModel} from '@angular/cdk/collections';
import {MatTableDataSource} from '@angular/material/table';
import { AbstractControl, FormArray, FormBuilder, FormGroup } from '@angular/forms';
import {  Validators } from '@angular/forms';
import {MatPaginator} from '@angular/material/paginator';
import {MatDatepickerInputEvent} from '@angular/material/datepicker';
import { AppComponent } from '../app.component';
enum TYPE{
SINGLE="single",
MULTI="multiple"
}
type NewType = ElementRef;

@Component({
selector: 'app-csv-dump-page',
templateUrl: './csv-dump-page.component.html',
styleUrls: ['./csv-dump-page.component.css','./../MenuBar/Menu.component.css'],
providers: [DatePipe]
})
export class CsvDumpPageComponent implements OnInit,AfterViewInit {
public data: any[];
public csvInfo:ICSVInfo;
public CSVAanalyzer: ICSVInfo[]; 
public _csvdetails: any[] = [];
public DBGUID:string;
public StartDate1:Date;
public EndDate1 : Date;
public IsCsv:boolean;
public IsJson:boolean;
public Analyzer_Name:string;
public CreatedBy: string;
public aa:boolean=false;
previousDate: string;
user: any[];
checked: boolean = false;
//public DBGUID1;
public arraypush:any[] =[];
public currentSortingType: TYPE = TYPE.SINGLE;
@ViewChild ('StartDate') input:NewType;
public columns: any[];
isSelected:boolean=true;
events: string[] = [];
//Date declaration
@ViewChild(MatPaginator) paginator: MatPaginator;
public _verificationHistoryList: IVerificationHistory[] = [];
public _filteredVerificationHistoryList: IVerificationHistory[] = [];
isCheckbox =false;

isTableHasData = true;
pageSize=5;

pageSizeOptions: number[] = [1];
//@ViewChild("myGrid") public igxGrid1: IgxGridComponent;
/*************************************************new grid *********************/
ELEMENT_DATA:GetAllinstances[];
displayedColumns: string[] = ['select','Analyzer_Name', 'DBGUID','StartDate','EndDate'];
dataSource = new MatTableDataSource
<GetAllinstances>
(this.ELEMENT_DATA);
selection = new SelectionModel
<GetAllinstances>
(true, []);
  m: string;
 
/** Whether the number of selected elements matches the total number of rows. */
isAllSelected() {
const numSelected = this.selection.selected.length;
const numRows = this.dataSource.data!==null? this.dataSource.data.length:0 ;
return numSelected === numRows;
}


/** Selects all rows if they are not all selected; otherwise clear selection. */
masterToggle() {
this.isAllSelected() ?
this.selection.clear() :
this.dataSource.data.forEach(row => this.selection.select(row));
}
StartDate = new FormControl('', [Validators.required]);
EndDate = new FormControl('', [Validators.required]);


getErrorMessage() {
    if (this.StartDate.hasError('required')) {
      return 'You must enter a value';
    }

    return this.StartDate.hasError('E-mail') ? 'Not a valid E-mail' : '';
  }

/** The label for the checkbox on the passed row */
checkboxLabel(row?:GetAllinstances): string {
if (!row) {
return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
}
return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.DBGUID + 1}`;
}
/*************************************************new grid ******************** */
//startDate and EndDate
dates:any[];
constructor(private appComponent: AppComponent,public datepipe: DatePipe,private toastr: ToastrService,private datePipe: DatePipe ,public _GlobalService: GlobalService,private _storageService: SessionStorageService,private ng4Spinner: Ng4LoadingSpinnerService, private _HomeService: HomeService, private routes:Router, private _CsvDumpSerrvice:CsvDumpService) { 

  if (this._storageService.Session_UserInfo) {
    if (this._storageService.Session_UserInfo.IsDefaultUser) {
      this.routes.navigate(['/ResetPass']);
    }
    if (this._storageService.Session_UserInfo.IsAbbEmail) {
      this.routes.navigate(['/Password']);
    }
  } else {
    this._storageService.clearSession();
   // this.routes.navigate(['/Login']);
  }

  appComponent.ngIdleImplementation();
  this.ng4Spinner.show();

} 
ngOnInit() : void
{
  
    // this.ng4Spinner.show();
    // setTimeout(()=>this.ng4Spinner.hide(),3000)

  this.getDBguidInstance();
  this.ng4Spinner.hide();
  
this.selection.onChange.subscribe(item=>{
this.isSelected= this.selection.selected.length>0?false:true;
})


this.dataSource.paginator = this.paginator;
}

public ngAfterViewInit() {
  this.ng4Spinner.show();
 // this.ng4Spinner.hide();
}


ngOnDestroy() {
  this.appComponent.resetTimeOut();

}

setPageSizeOptions(setPageSizeOptionsInput: string) {
  this.pageSizeOptions = setPageSizeOptionsInput.split(',').map(str => +str);
}


addEvent(type: string, event: MatDatepickerInputEvent<Date>) {
  this.events.push(`${type}: ${event.value}`);
}

applyFilter(filterValue: string) {
  filterValue = filterValue.trim(); // Remove whitespace
  filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
  this.dataSource.filter = filterValue;
  if(this.dataSource.filteredData!==null){
  if(this.dataSource.filteredData.length > 0){
    this.isTableHasData = true;
  } else {
    this.isTableHasData = false;
  }
}
}

validateStartandEndDate(){
 //  var showDownload =true;
    console.log(this.selection.selected);

   
    if(this.selection.selected.length>0){
        this.isSelected=false;
  

         var date2=this.selection.selected.filter(x=>x.StartDate ===null && x.EndDate===null);
         if(date2.length >0){
           this.isSelected=false;
         }

         var d25=this.selection.selected.filter(x=>x.StartDate ==='' && x.EndDate==='');
         if(d25.length >0){
           this.isSelected=false;
         }

         var d26=this.selection.selected.filter(x=>x.StartDate ===undefined && x.EndDate===undefined);
         if(d26.length >0){
           this.isSelected=false;
         }

        var dt = this.selection.selected.filter(x=>x.StartDate ===null  && x.EndDate !==null);
        if(dt.length >0){
            this.isSelected=true;
        }

        var dt12 = this.selection.selected.filter(x=>x.StartDate ===null  && x.EndDate !==undefined);
        if(dt12.length >0){
          // this.toastr.error('Please Provide valid Start Date...! ', 'ERROR', {
          //   timeOut: 2000,
          //   });
            this.isSelected=true;
        }

        var dt23 = this.selection.selected.filter(x=>x.StartDate ===''  && x.EndDate !=='');
        if(dt23.length >0){
          this.toastr.error('Please input a valid Start Date.', 'ERROR', {
            timeOut: 2000,
            });
            this.isSelected=true;
        }

        var dt13 = this.selection.selected.filter(x=>x.StartDate !==undefined  && x.EndDate ===undefined);
        if(dt13.length >0){
       //   this.toastr.error('Please Provide valid End Date...! ', 'ERROR', {
        //    timeOut: 2000,
         //   });
            this.isSelected=true;
        }

        var dt15 = this.selection.selected.filter(x=>x.StartDate ===""  && x.EndDate ===undefined);
        if(dt15.length >0){
       
            this.isSelected=false;
        }

        var dt16 = this.selection.selected.filter(x=>x.StartDate ===undefined  && x.EndDate ==="");
        if(dt16.length >0){       
            this.isSelected=false;
        }
        var d27= this.selection.selected.filter(x=>(x.StartDate === "" && x.EndDate < "1900"));
        if(d27.length>0){
          this.isSelected =true;
         
        }

        var dd27= this.selection.selected.filter(x=>(x.StartDate < "1900" && x.EndDate < "1900"));
        if(dd27.length>0){
          this.isSelected =true;
          // this.toastr.error('Date must be 01-01-1900 or later...! ', 'ERROR', {
          //   timeOut: 2000,
          // });
        }
        var datescenario_case_16= this.selection.selected.filter(x=>(x.StartDate >= "0001" && x.EndDate <= "1900"));
        if(datescenario_case_16.length>0){
          this.isSelected =true;
    
        }

        var datescenario_case_17= this.selection.selected.filter(x=>(x.StartDate === "1900" && x.EndDate === "1900"));
        if(datescenario_case_17.length>0){
          this.isSelected =false;
          
        }

        var datescenario_case_18= this.selection.selected.filter(x=>(x.StartDate <= "1900" && x.EndDate >= "1900"));
        if(datescenario_case_18.length>0){
          this.isSelected =true;
         
        }

        var dt18= this.selection.selected.filter(x=>x.StartDate < "1900" && x.EndDate==="");
        if(dt18.length>0){
          this.isSelected =true;
        
        }


        var dd1= this.selection.selected.filter(x=>(x.StartDate === "" && x.EndDate === ""));
        if(dd1.length>0){
          this.isSelected =false;
        }
      
        
      var dt1= this.selection.selected.filter(x=>x.StartDate !=='' && x.EndDate==='');
       if(dt1.length >0){
        this.toastr.error('Please input a valid End Date.', 'ERROR', {
          timeOut: 2000,
          });
        this.isSelected=true;
        }

        var d4_senario_case_4 =this.selection.selected.filter(x=>x.EndDate < x.StartDate && x.EndDate !=='')
        if(d4_senario_case_4.length>0){
            this.isSelected=true;
           this.toastr.error('End Date should not be less than Start Date.', 'ERROR', {
             timeOut: 4000,
             });
        }
        var dt10= this.selection.selected.filter(x=>x.StartDate !==null && x.EndDate ===null);
        if(dt10.length >0){
         this.isSelected=true;
         }

      var d2 = this.selection.selected.filter(x=>x.StartDate !==null && x.EndDate !==null);
      if(d2.length >0){
          var todayDate= this.datepipe.transform(new Date(),'yyyy-MM-dd');
           var previousDate =new Date();
          this.previousDate =this.datePipe.transform(this.previousDate,'yyyy-MM-dd');
          console.log(previousDate.getFullYear());
          console.log(this.input.nativeElement.value);
        
       
          var dd3= d2.filter(x=>x.StartDate > todayDate && x.EndDate <= todayDate);
          if(dd3.length>0){
            this.isSelected =true;
            this.toastr.error('Start Date should not exceed todays date.', 'ERROR', {
              timeOut: 2000,
             });
            }
          var d5= d2.filter(x=>x.StartDate >todayDate && x.EndDate > todayDate);
          if(d5.length>0){
            this.isSelected =true;
            this.toastr.error("Dates should not exceed today's date.", 'ERROR', {
              timeOut: 2000,
              });
          }


          var d7= d2.filter(x=>x.StartDate <= todayDate && x.EndDate > todayDate);
          if(d7.length>0){
            this.isSelected =true;
            this.toastr.error("End Date should not exceed today's date.", 'ERROR', {
              timeOut: 2000,
              });
          }
          var d4 =d2.filter(x=>x.StartDate > x.EndDate)
          if(d4.length>0){
            
              this.isSelected=true;
          
          }
      }  
    }
}

postDATA(){
let  result:ICSVInfo[]=[];
this.selection.selected.forEach(s => {
let a:ICSVInfo={
DBGUID: s.DBGUID,
Analyzer_Name:s.Analyzer_Name,
StartDate:this.datepipe.transform(s.StartDate,'MM/dd/yyyy'),
EndDate:this.datepipe.transform(s.EndDate,'MM/dd/yyyy'),
IsCsv:true,
IsJson:true
}
//console.log(a);
result.push(a)
console.log(result);
console.log(a.DBGUID);
});
this.selection.onChange.subscribe(item=>{
this.isSelected= this.selection.selected.length>0?false:true;
})
this.toastr.info('Exporting data, please wait.', 'INFO', {
timeOut: 4000,
});
//console.log(this._csvdetails);
this._CsvDumpSerrvice.postCSVAnalyzer(result).subscribe(
response=>{
if(response ==null || response.status ===204){
this.toastr.error('Please input valid dates.', 'ERROR', {
timeOut: 5000,
});
}

else{
let blob = new Blob([response], { type: 'application/zip' });
const filename ='DeviceData.zip';
this.toastr.success('Data has been exported.', 'SUCCESS', {
timeOut: 5000,
});
saveAs(blob, filename);   
}
});
//this.ng4Spinner.show();
}

getDBguidInstance(){
 // this.ng4Spinner.show();
this._CsvDumpSerrvice.getAllCsvInstance(this._storageService.Session_UserInfo.Email,
  
this._storageService.Session_UserInfo.Email).subscribe(res=>{
 // this.ng4Spinner.show();
this.dataSource.data=res as GetAllinstances[];


this.pageSize=5;

});

}
}
