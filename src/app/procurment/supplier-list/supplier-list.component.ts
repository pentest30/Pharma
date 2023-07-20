import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  OnInit,
  Output,
  ViewChild,
} from "@angular/core";
import {
  Column,
  DataStateChangeEventArgs,
  GridComponent,
  parentsUntil,
  RowSelectEventArgs,
  SelectionSettingsModel,
  ToolbarItems,
} from "@syncfusion/ej2-angular-grids";
import { DataManager, UrlAdaptor } from "@syncfusion/ej2-data";
import { environment } from "src/environments/environment";
import { AuthService } from "src/app/services/auth.service";
import { loadCldr, setCulture } from "@syncfusion/ej2-base";
import { MatDialogRef } from "@angular/material/dialog";
import { NotificationHelper } from "src/app/shared/notif-helper";
import { CustomerProfile } from "src/app/sales/sales-models/customer-profile";
import { SupplierOrderService } from "src/app/services/supplier-order.service";
import { BaseEventFilterGridComponent } from "src/app/shared/BaseEventFilterGrid";
@Component({
  selector: 'app-supplier-list',
  templateUrl: './supplier-list.component.html',
  styleUrls: ['./supplier-list.component.sass']
})
export class SupplierListComponent  implements OnInit {
  suppliers: CustomerProfile[];
  @ViewChild("grid")
  public grid: GridComponent;
  @Output() onAdd = new EventEmitter();
  @ViewChild("searchName") searchName: ElementRef<HTMLInputElement>;
  toolbar: ToolbarItems[];
  public selectionOptions: SelectionSettingsModel;
  public state: DataStateChangeEventArgs;
  supplierOrders: any[] = [];
  constructor(
    private supplierOrderService: SupplierOrderService,
    private dialogRef: MatDialogRef<SupplierListComponent>,
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
  keyPressed(e) {
    console.log(e);
    if (e.key === "Enter" && this.checkFocusOnRows()) {
      var customer = this.grid.getSelectedRecords()[0] as CustomerProfile;
      if(customer.customerStatus =="Actif" )
        this.onAdd.emit(this.grid.getSelectedRecords()[0] as CustomerProfile);
        else  if(customer && customer.customerStatus !="Actif")    
        this.notif.showNotification('mat-warn',"Client en état bloqué", null, null);
      this.dialogRef.close(customer);
      return;
    }
    var currentEle = parentsUntil(e.target, "e-filtertext"); 
    if (e.key === "Enter" && this.checkFocusOnRows()) {
     var customer = this.grid.getSelectedRecords()[0] as CustomerProfile;
     if(customer.customerStatus =="Actif" )
       this.onAdd.emit(this.grid.getSelectedRecords()[0] as CustomerProfile);
       else  if(customer && customer.customerStatus !="Actif")    
       this.notif.showNotification('mat-warn',"Client en état bloqué", null, null);
    
     return;
    }
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
    //this.grid.autoFitColumns();
    // here we are selecting the row after the refresh Complete
    this.grid.selectRow(0);
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
    
  }
  clickHandler(args) {
    console.log(args);
  }
  Doubleclick(e){ 
    if(!e.rowData)
    return;
    var customer = e.rowData as CustomerProfile;
    if(customer.customerStatus =="Actif" )
      {
        this.onAdd.emit(e.rowData as CustomerProfile);
        this.dialogRef.close(e.rowData);
      }
    else  this.notif.showNotification('mat-warn',"Client en état bloqué", null, null);
   
   
    return;

  } 
  rowSelected(args: RowSelectEventArgs) {
    
    this.selectedrowindex = this.grid.selectedRowIndex;
    var customerId = (this.grid.getSelectedRecords()[0] as CustomerProfile)
      .organizationId;
    this.supplierOrderService.getAllCompletedOrders(customerId).subscribe((res) => {
      this.supplierOrders = <any>res;
    });
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

  public dataStateChange(state: DataStateChangeEventArgs): void {
  }
  close (){
    this.dialogRef.close(null);
  }

}
