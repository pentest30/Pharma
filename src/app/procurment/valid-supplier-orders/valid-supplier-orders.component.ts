import { Component, ElementRef, EventEmitter, HostListener, OnInit, Output, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Column, DataStateChangeEventArgs, GridComponent, parentsUntil, RowSelectEventArgs, SelectionSettingsModel, ToolbarItems } from '@syncfusion/ej2-angular-grids';
import { loadCldr, setCulture } from '@syncfusion/ej2-base';
import { AuthService } from 'src/app/services/auth.service';
import { SupplierOrderService } from 'src/app/services/supplier-order.service';
import { NotificationHelper } from 'src/app/shared/notif-helper';
import { environment } from 'src/environments/environment';
import { DataManager, UrlAdaptor } from "@syncfusion/ej2-data";
import { CustomerProfile } from 'src/app/sales/sales-models/customer-profile';
import { SupplierOrder } from '../models/SupplierOrder';
import { T } from '@angular/cdk/keycodes';

@Component({
  selector: 'app-valid-supplier-orders',
  templateUrl: './valid-supplier-orders.component.html',
  styleUrls: ['./valid-supplier-orders.component.sass']
})
export class ValidSupplierOrdersComponent implements OnInit {

  @ViewChild("grid") public grid: GridComponent;
  @ViewChild("gridOrders") public gridOrders: GridComponent;

  @Output() onAdd = new EventEmitter();
  @ViewChild("searchName") searchName: ElementRef<HTMLInputElement>;
  toolbar: ToolbarItems[];
  public selectionOptions: SelectionSettingsModel;
  public state: DataStateChangeEventArgs;
  supplierOrders: any[] = [];
  selectedSupplier: any;
  constructor(
    private supplierOrderService: SupplierOrderService,
    private dialogRef: MatDialogRef<ValidSupplierOrdersComponent>,
    private authService: AuthService,
    private notif: NotificationHelper,
  ) {
    setCulture('fr');
    loadCldr(require('./../../sales/numbers.json'));
  }
  gridLines: any;
  selectedrowindex: number;
  previousSelection: any;
  searchActive: boolean = false;

  public data: any[] = [];
  public dataSuppliers: DataManager;

  async ngOnInit() {
    this.gridLines = "Both";
    this.selectionOptions = { mode: "Row" };

    this.dataSuppliers = new DataManager({
      url: environment.ResourceServer.Endpoint + "suppliers/post",
      adaptor: new UrlAdaptor(),
      headers: [{ Authorization: "Bearer " + this.authService.getToken }],
    });
  }
  load(args) { 
    
    var ele = document
    .getElementsByClassName("e-filtertext")
    .namedItem("name_filterBarcell");
  } 
  loadOrderGrid(args) { 
    
    var ele = document
    .getElementsByClassName("e-filtertext")
    .namedItem("name_filterBarcell");
  } 
  keyPressed(e) {
    if (e.key === "Enter" && this.checkFocusOnRows()) {
      e.cancel = true;  // prevent the default behavior of enter key with Grid 
      this.gridOrders.selectedRowIndex = 0;
      return;

    }
    var currentEle = parentsUntil(e.target, "e-filtertext"); 
 
    if(currentEle && currentEle.getAttribute("id") ){ 
      let currIndex = this.grid.columns.findIndex(c => c.field == currentEle.getAttribute("id").replace("_filterBarcell","") );
      if(e.key =="ArrowDown") {
       console.log(this.grid.element.getElementsByClassName('e-filtertext e-input').item(currIndex).getAttribute("id"));
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
    // here we are selecting the row after the refresh Complete
    this.grid.selectRow(0);

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
    
  }
  clickHandler(args) {
  }
  async Doubleclick(e){ 
    if(!e.rowData)
    return;

        this.onAdd.emit(e.rowData as CustomerProfile);
        this.selectedSupplier = e.rowData;
        this.data = <any>await this.supplierOrderService.getAllValidOrders(e.rowData.organizationId).toPromise();
   
    return;

  } 
  async rowSelected(args: RowSelectEventArgs) {
    
    this.selectedrowindex = this.grid.selectedRowIndex;
    var supplierId = (this.grid.getSelectedRecords()[0] as CustomerProfile)
      .organizationId;
      this.selectedSupplier = (this.grid.getSelectedRecords()[0] as CustomerProfile);
      this.data = <any>await this.supplierOrderService.getAllValidOrders(supplierId).toPromise();

  }
  rowSelectedOrder(args: RowSelectEventArgs) {
    this.selectedrowindex = this.grid.selectedRowIndex;
  
  }
  @HostListener("document:keydown", ["$event"])
  handleKeyboardEvent(event: KeyboardEvent) {

    switch (event.key) {
      case "F9":
        var ele = document
        .getElementsByClassName("e-filtertext")
        .namedItem("name_filterBarcell");
        if(!this.searchActive) {
        
        setTimeout(() => (ele as HTMLElement).focus(), 0);

        }
        else {
         //console.log(this.grid.getRows()[0]);
          setTimeout(() => (ele as HTMLElement).blur(), 0);
          this.grid.selectRow(0);
        };
       this.searchActive =!this.searchActive;
        break;

      default:
        break;
    }
  }
  public dataBoundOrderGrid(e) {
    this.grid.selectRow(0);
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
    
  }
  DoubleclickOrder(e){ 
    if(!e.rowData)
    return;

    this.onAdd.emit(e.rowData as SupplierOrder);
    console.log()
    this.dialogRef.close({
      supplierOrder: e.rowData,
      supplier: this.selectedSupplier
    });
     
   
    return;

  } 
  keyPressedOrder(e) {
   
    this.onAdd.emit(e.rowData as SupplierOrder);
    this.dialogRef.close({
      supplierOrder: this.gridOrders.getSelectedRecords()[0],
      supplier: this.selectedSupplier
    });
     
  }
  close (){
    this.dialogRef.close(null);
  }
}
