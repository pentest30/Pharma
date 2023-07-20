import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { CellEditArgs, EditSettingsModel, GridComponent, ToolbarItems } from '@syncfusion/ej2-angular-grids';
import { DataManager } from '@syncfusion/ej2-data';
import { InventQuota } from 'src/app/inventory/inventsum/models/quota-invent';
import { UserApp } from 'src/app/membership/models/user-app';
import { Product } from 'src/app/product/prodcut-models/product';
import { AuthService } from 'src/app/services/auth.service';
import { CustomerService } from 'src/app/services/customer.service';
import { InventSumService } from 'src/app/services/inventory.service';
import { ProductService } from 'src/app/services/product.service';
import { QuotaService } from 'src/app/services/quota.service';
import { SignalRService } from 'src/app/services/signal-r.service';
import { UserService } from 'src/app/services/user.service';
import { NotificationHelper } from 'src/app/shared/notif-helper';
import { Customer } from 'src/app/tiers/customer/models/customer-model';
import { Quota } from '../../Models/quota.model';

@Component({
  selector: 'app-quota-resuqet-by-products',
  templateUrl: './quota-resuqet-by-products.component.html',
  styleUrls: ['./quota-resuqet-by-products.component.sass']
})
export class QuotaResuqetByProductsComponent implements OnInit {
  inventQuotas : any[];
  selectedProduct: any;
  selectedCustomer: Customer;
  customers: Customer[];
  products: any[] = [];
  requestedProducts: any[] = [];
  data: DataManager;
  salesPersons: UserApp[];
  quotaValue: number = 0;
  productId: string;
  selectedQuota: Quota;
  public editSettings: EditSettingsModel;
  public toolbar: ToolbarItems[];
  @ViewChild("grid")
  public grid: GridComponent;
  gridLines: string;
  
  constructor( private dialogRef: MatDialogRef<QuotaResuqetByProductsComponent>,
    private productService: ProductService,
    private quotaService: QuotaService,
    private authService: AuthService,
    private userService: UserService,
    private notif: NotificationHelper,
    private customerService: CustomerService,
    private signarlRService: SignalRService,
    private inventSumService : InventSumService) { }

  async ngOnInit() {
    var orgId = this.authService.profile["organizationId"];
    this.products = await this.productService.getProductsQuota().toPromise();
    this.inventQuotas = await (await this.inventSumService.getProductsForQuota(orgId).toPromise());
  this.inventQuotas.forEach(element => {
    element.requestedQuantity = 1;
  });
    //this.salesPersons = await this.userService.getSalesPersons().toPromise();
    this.customers = await this.customerService.customerBySalesPerson().toPromise();
    this.gridLines = "Both";
    this.editSettings = { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Normal' };
    this.toolbar = ['Add', 'Edit', 'Delete', 'Update', 'Cancel'];
  }
  onClientSelection($event) {

  }
  onPorductSelection($event) {
   console.log();
  if($event )
   {
    var lastItem = $event[$event.length - 1] ;
    if(lastItem && lastItem.physicalDispenseQuantity<=0){
      this.notif.showNotification('mat-warn'," Quantité non disponible " ,'top','right');
      return;
    }
   }
  if($event) this.requestedProducts = $event;
  else this.requestedProducts = [...$event];
   this.grid.dataSource = this.requestedProducts;
   this.grid.refresh();

  }
  customSearchFn(term: string, item: any) {
    if (term != undefined) {
      term = term.toLocaleLowerCase();
      return (
        (item.productCode != undefined &&
          item.productCode.toLocaleLowerCase().indexOf(term) > -1) ||
        item.productFullName.toLocaleLowerCase().indexOf(term) > -1
      );
    }
  }
  filterByQnt($event) {

  }
  cellEdit(args: CellEditArgs) {
    // if (args.columnName !== 'requestedQuantity') {
    //     args.cancel = true;
    // }
}
getIndexRow(index) {
  return this.grid.getRowIndexByPrimaryKey(index) + 1;
}
actionComplete(args) {
  
  if (args.requestType === "beginEdit" || args.requestType === "add") {
    //this.setFocus.edit.obj.element.focus();
  }
  if (args.requestType === "save") {
    if(args.data.physicalDispenseQuantity< args.data.requestedQuantity )
    {
      this.notif.showNotification('mat-warn',"La quantité ne doit pas être superieure à la quantité disponible " + args.data.physicalDispenseQuantity ,'top','right');
      console.log( args.rowData.requestedQuantity);
      var item = this.requestedProducts.find(x=>x.productId == args.data.productId)
      item.requestedQuantity = args.rowData.requestedQuantity;
      this.grid.refresh();
      return;
    
    } 
   

    this.grid.refresh();
  }
  
}
async save() {
  this.requestedProducts.forEach(async item=> {
    var command = {
      productCode: item.productCode,
      customerId: this.selectedCustomer,
      productName: item.productFullName,
      productId: item.productId,
      quantity: item.requestedQuantity,
      destSalesPersonId:null,
      forBuyer: true,
      forSupervisor: false,
    };
   var r=  await this.quotaService.postRequest(command).toPromise();
    
  });
  this.notif.showNotification(
    "mat-success",
    "Demande créée avec succès",
    "top",
    "right"
  );

  this.dialogRef.close(this.requestedProducts);
}
close() {
  this.dialogRef.close();
}

}
