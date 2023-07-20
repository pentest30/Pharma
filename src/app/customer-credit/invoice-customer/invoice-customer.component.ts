import { Component, ElementRef, EventEmitter, HostListener, OnInit, Output, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { GridComponent, ToolbarItems, DataStateChangeEventArgs, parentsUntil, Column, RowSelectEventArgs, SelectionSettingsModel } from '@syncfusion/ej2-angular-grids';
import { DataManager, UrlAdaptor } from '@syncfusion/ej2-data';
import { Invoice } from 'src/app/billing/models/Invoice';
import { CustomerProfile } from 'src/app/sales/sales-models/customer-profile';
import { AuthService } from 'src/app/services/auth.service';
import { InvoiceService } from 'src/app/services/invoice.service';
import { BaseComponent } from 'src/app/shared/BaseComponent';
import { NotificationHelper } from 'src/app/shared/notif-helper';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-invoice-customer',
  templateUrl: './invoice-customer.component.html',
  styleUrls: ['./invoice-customer.component.sass']
})
export class InvoiceCustomerComponent extends BaseComponent implements OnInit {
  @ViewChild("grid")
  public grid: GridComponent;
  @Output() onAdd = new EventEmitter();
  @ViewChild("searchName") searchName: ElementRef<HTMLInputElement>;
  toolbar: ToolbarItems[];
  public selectionOptions: SelectionSettingsModel;
  public state: DataStateChangeEventArgs;
  public dropState: string[]  = ["Actif", "Bloqué"];
  public fieldType: object = { text: 'customerState', value: 'customerState' };
  currentUrl: string = '';
  flag: any = true;
  pageSettings: { pageSizes: boolean; pageSize: number; };
  savedColumnProperties: any;
  gridLines: any;
  selectedrowindex: number;
  previousSelection: any;
  searchActive: boolean = false;

  public data: DataManager;
  constructor(
    private dialogRef: MatDialogRef<InvoiceCustomerComponent>,
    private authService: AuthService,
    private router : Router,
    private notif: NotificationHelper,
  ) { 
    super(authService,null);
  }

  async ngOnInit() {
    this.selectionOptions = { mode: "Row" };
    this.data = new DataManager({
      url: environment.ResourceServer.Endpoint + "invoices" + "/search",
      adaptor: new UrlAdaptor(),
      headers: [{ Authorization: "Bearer " + this.authService.getToken }],
    });
  }
  load(args) { 
    let userPreferences = JSON.parse(localStorage.getItem('customerGridPersist'));
    this.grid.columns.forEach(element => {
      if(userPreferences && userPreferences.columns) {
        let find = userPreferences.columns.find(c => c.field == element.field);
        if(find) {
          element.visible = find.visible;
          
        }
      }
      return element;
    });
  } 
  keyPressed(e) {
    var currentEle = parentsUntil(e.target, "e-filtertext"); 
    if (e.key === "Enter" && this.checkFocusOnRows() && this.currentUrl == "/sales/add-customer-credit") {
      let invoice = this.grid.getSelectedRecords()[0] as Invoice;
      console.log(invoice);
        this.onAdd.emit(invoice as Invoice);
    
    }

    if(currentEle && currentEle.getAttribute("id") ){ 
      let currIndex = this.grid.columns.findIndex(c => c.field == currentEle.getAttribute("id").replace("_filterBarcell","") );
      if(e.key =="ArrowDown") {
        let id = this.grid.element.getElementsByClassName('e-filtertext e-input').item(currIndex).getAttribute("id");
        document.getElementById(id).blur();
        this.grid.selectedRowIndex = 0;
      }
      if(e.key =="ArrowRight") {
        let nextElement = (<Column[]>this.grid.columns).find(c => c.index == currIndex + 1);
        while (!nextElement.allowFiltering ) {
          currIndex+=1;
          nextElement = (<Column[]>this.grid.columns).find(c => c.index == currIndex );
        }
        if(this.searchActive) {  
          var ele = document.getElementsByClassName("e-filtertext").namedItem(nextElement.field + "_filterBarcell");
          setTimeout(() => (ele as HTMLElement).focus(), 0);
        }
      }
      if(e.key =="ArrowLeft") {
        let previousElem = (<Column[]>this.grid.columns).find(c => c.index == currIndex - 1);
        while (!previousElem.allowFiltering ) {
          currIndex-=1;
          previousElem = (<Column[]>this.grid.columns).find(c => c.index == currIndex );
  
        }
        if(this.searchActive) {  
          var ele = document.getElementsByClassName("e-filtertext").namedItem(previousElem.field + "_filterBarcell");
          setTimeout(() => (ele as HTMLElement).focus(), 0);
        }
      }
    }
  }
  checkFocusOnRows() {
    for (
      let index = 0;
      index < document.getElementsByClassName("e-rowcell").length;
      index++
    ) {
      const element = document.getElementsByClassName("e-rowcell")[index];
      if (element === document.activeElement) return true;
    }
    return false;
  }
  public dataBound(e) {
    this.grid.autoFitColumns();
    this.grid.enablePersistence = true;
    this.grid.selectRow(0);
    var ele = document
        .getElementsByClassName("e-filtertext")
        .namedItem("name_filterBarcell");
    if(ele) {
      if(!this.searchActive) {
        setTimeout(() => (ele as HTMLElement).focus(), 0);
        }
        else {
          setTimeout(() => (ele as HTMLElement).blur(), 0);
          this.grid.selectRow(0);
        };
       this.searchActive =!this.searchActive;
    }
      
    
  }
  clickHandler(args) {
  }
  Doubleclick(e){ 
    if(!e.rowData )
    return;
    var invoice = e.rowData as Invoice;
    this.onAdd.emit(e.rowData as Invoice);
    this.dialogRef.close(e.rowData);
    return;

  } 
  
  @HostListener("document:keydown", ["$event"])
  handleKeyboardEvent(event: KeyboardEvent) {

    switch (event.key) {
      case "Escape":
        event.preventDefault();
        this.close();
        break;
      case "F9":
        var ele = document
        .getElementsByClassName("e-filtertext")
        .namedItem("name_filterBarcell");
        if(!this.searchActive) {
        
        setTimeout(() => (ele as HTMLElement).focus(), 0);

        }
        else {
          setTimeout(() => (ele as HTMLElement).blur(), 0);
          this.grid.selectRow(0);
        };
       this.searchActive =!this.searchActive;
        break;

      default:
        break;
    }
  }

  public complete(args:any) { 
    if(args.requestType == "columnstate") { 
      let payload = JSON.parse(this.grid.getPersistData());
      localStorage.setItem('customerGridPersist', JSON.stringify(payload));     

    } 
  } 
  public begin(args:any):void{ 
    if(args.requestType == "columnstate" ) {  

      this.savedColumnProperties = this.grid.columns;
    }  
    if(args.requestType == "filtering" && args.currentFilteringColumn == "name") {  

          args.columns.forEach(col => {   
            if(col.field == 'name') {   
                col.operator = 'startsWith';       // set the “contains” operator for the ‘CustomerID’ column  
            }   
         });   
    }  
  } 
  close (){
    this.dialogRef.close(null);
  }

}
