import { Component, ElementRef, EventEmitter, HostListener, OnInit, Output, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { DataStateChangeEventArgs, GridComponent, RowSelectEventArgs, SelectionSettingsModel, ToolbarItems } from '@syncfusion/ej2-angular-grids';
import { loadCldr, setCulture } from '@syncfusion/ej2-base';
import { AuthService } from 'src/app/services/auth.service';
import { NotificationHelper } from 'src/app/shared/notif-helper';
import { environment } from 'src/environments/environment';
import { DataManager, UrlAdaptor } from "@syncfusion/ej2-data";
import { SupplierInvoice } from '../models/SupplierInvoice';
import { SupplierInvoiceService } from 'src/app/services/supplier-invoice.service';
@Component({
  selector: 'app-valid-supplier-invoices',
  templateUrl: './valid-supplier-invoices.component.html',
  styleUrls: ['./valid-supplier-invoices.component.sass']
})
export class ValidSupplierInvoicesComponent implements OnInit {

  @ViewChild("grid") public grid: GridComponent;
  @ViewChild("gridOrders") public gridOrders: GridComponent;

  @Output() onAdd = new EventEmitter();
  @ViewChild("searchName") searchName: ElementRef<HTMLInputElement>;
  toolbar: ToolbarItems[];
  public selectionOptions: SelectionSettingsModel;
  public state: DataStateChangeEventArgs;
  supplierOrders: any[] = [];
  selectedSupplier: any;
  selectedInvoice: SupplierInvoice;
  supplierInvoice: any;
  constructor(
    private supplierInvoiceService: SupplierInvoiceService,
    private dialogRef: MatDialogRef<ValidSupplierInvoicesComponent>,
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

  public data: DataManager;

  async ngOnInit() {
    this.gridLines = "Both";
    this.selectionOptions = { mode: "Row" };

    this.data = new DataManager({
      url: environment.ResourceServer.Endpoint + "supplier-invoices" + "/search",
      adaptor: new UrlAdaptor(),
      headers: [{ Authorization: "Bearer " + this.authService.getToken ,validInvoice: true}],
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

  async keyPressed(e) {
    if (e.key === "Enter" && this.checkFocusOnRows()) {
      console.log(this.grid.getSelectedRecords()[0]);
      e.cancel = true;
      let supplierInvoice = this.grid.getSelectedRecords()[0] as SupplierInvoice;
      this.onAdd.emit(supplierInvoice);
      this.supplierInvoice = <SupplierInvoice> await this.supplierInvoiceService.getInvoiceById(supplierInvoice.id).toPromise();
      this.dialogRef.close(supplierInvoice);
    }
    if(e.key =="ArrowDown") {
      let id = this.grid.element.getElementsByClassName('e-filtertext e-input').item(2).getAttribute("id");
      document.getElementById(id).blur();
      this.grid.selectedRowIndex = 0;
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
    // here we are selecting the row after the refresh Complete
    this.grid.selectRow(0);
    
    var ele = document.getElementsByClassName("e-filtertext").namedItem("name_filterBarcell");
    console.log(ele);
    if(ele != null) {
      if(!this.searchActive ) {
        
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
  async Doubleclick(e){ 
    if(!e.rowData)
    return;
        this.onAdd.emit(e.rowData as SupplierInvoice);
        this.supplierInvoice = <SupplierInvoice>await this.supplierInvoiceService.getInvoiceById(e.rowData.id).toPromise();
        this.dialogRef.close(this.supplierInvoice);
    return;

  } 
  async rowSelected(args: RowSelectEventArgs) {
    this.selectedrowindex = this.grid.selectedRowIndex;
    this.selectedInvoice = (this.grid.getSelectedRecords()[0] as SupplierInvoice);

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
    this.grid.autoFitColumns();
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
 

}
