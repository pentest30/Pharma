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
import { OrdersService } from "src/app/services/orders.service";
import { CustomerProfile } from "../sales-models/customer-profile";
import { Order } from "../sales-models/Order";
import { DataManager, UrlAdaptor } from "@syncfusion/ej2-data";
import { environment } from "src/environments/environment";
import { AuthService } from "src/app/services/auth.service";
import { MatDialogRef } from "@angular/material/dialog";
import { NotificationHelper } from "src/app/shared/notif-helper";
import { BaseComponent } from "src/app/shared/BaseComponent";
import { Router } from "@angular/router";
@Component({
  selector: "app-customer-list",
  templateUrl: "./customer-list.component.html",
  styleUrls: ["./customer-list.component.sass"],
})
export class CustomerListComponent extends BaseComponent implements OnInit {
  customers: CustomerProfile[];
  @ViewChild("grid")
  public grid: GridComponent;
  @Output() onAdd = new EventEmitter();
  @ViewChild("searchName") searchName: ElementRef<HTMLInputElement>;
  toolbar: ToolbarItems[];
  orders: Order[] = [];
  public selectionOptions: SelectionSettingsModel;
  public state: DataStateChangeEventArgs;
  public dropState: string[]  = ["Actif", "Bloqué"];
  public fieldType: object = { text: 'customerState', value: 'customerState' };
  currentUrl: string = '';
  flag: any = true;
  pageSettings: { pageSizes: boolean; pageSize: number; };
  savedColumnProperties: any;
  constructor(
    private ordersService: OrdersService,
    private dialogRef: MatDialogRef<CustomerListComponent>,
    private authService: AuthService,
    private router : Router,
    private notif: NotificationHelper,
  ) {
    super(authService,null);
    this.currentUrl = router.url;
  }
  gridLines: any;
  selectedrowindex: number;
  previousSelection: any;
  searchActive: boolean = false;

  public data: DataManager;
  async ngOnInit() {
    this.filterOptions = { columns: [ 
      { field: 'customerState', matchCase: false, operator: 'equal', predicate: 'or', value: "0" }] };
    this.selectionOptions = { mode: "Row" };
    this.data = new DataManager({
      url: environment.ResourceServer.Endpoint + "customers" + "/salesperson/post",
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
      if (e.key === "Enter" && this.checkFocusOnRows() && this.currentUrl == "/sales/add-order") {
        let customer = this.grid.getSelectedRecords()[0] as CustomerProfile;
        console.log(customer);
        if(customer.customerStatus =="Actif" ){
          this.onAdd.emit(customer as CustomerProfile);
        }
        else {
          e.cancel = true;
          this.notif.showNotification('mat-warn',"Client en état bloqué", null, null);
        }
      }

      if (e.key === "Enter" && this.checkFocusOnRows() && this.currentUrl != "/sales/add-order") {
       //e.preventDefault();
      //e.cancel = true;  // prevent the default behavior of enter key with Grid 
      let customer = this.grid.getSelectedRecords()[0] as CustomerProfile;
      console.log(customer);
      if(customer.customerStatus =="Actif" ){
        this.onAdd.emit(customer as CustomerProfile);
      }
      else {
        e.cancel = true;
        this.notif.showNotification('mat-warn',"Client en état bloqué", null, null);
      }
      return false;
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
        console.log(1);

        setTimeout(() => (ele as HTMLElement).focus(), 100);
      }
      else {
        console.log(2);

        setTimeout(() => (ele as HTMLElement).blur(), 100);
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
    let selectedCustomer = (this.grid.getSelectedRecords()[0] as CustomerProfile);
    if(selectedCustomer) {
      var customerId = selectedCustomer.organizationId;
      this.ordersService.getAllOrdersFrocustomer(customerId).subscribe((res) => {
        this.orders = res;
      });
    }
   


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
      // let t = payload.columns.map(element => {
      //   let find = this.savedColumnProperties.find(c => c.field == element.field);
      //   if(find != null)  {
      //     const returnedTarget = Object.assign({}, find);
      //     returnedTarget.visible = element.visible;
      //     return returnedTarget;
        
      //   } else 
      //   return element;
      // });
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
