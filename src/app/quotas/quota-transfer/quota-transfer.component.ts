import { MatDialog, MatDialogClose, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, Inject, OnInit, ViewChild } from "@angular/core";
import { Product } from "src/app/product/prodcut-models/product";
import { ProductService } from "src/app/services/product.service";
import { DataManager, UrlAdaptor } from "@syncfusion/ej2-data";
import { QuotaService } from "src/app/services/quota.service";
import { environment } from "src/environments/environment";
import { AuthService } from "src/app/services/auth.service";
import { UserService } from "src/app/services/user.service";
import { UserApp } from "src/app/membership/models/user-app";
import { Customer } from "src/app/tiers/customer/models/customer-model";
import { CustomerService } from "src/app/services/customer.service";
import { GridComponent } from "@syncfusion/ej2-angular-grids";
import { Quota } from "../Models/quota.model";
import { NotificationHelper } from "src/app/shared/notif-helper";
import { SignalRService } from "src/app/services/signal-r.service";
import { InventQuota } from 'src/app/inventory/inventsum/models/quota-invent';
import { InventSumService } from 'src/app/services/inventory.service';
@Component({
  selector: "app-quota-transfer",
  templateUrl: "./quota-transfer.component.html",
  styleUrls: ["./quota-transfer.component.sass"],
})
export class QuotaTransferComponent implements OnInit {
  destination: number = 1;
  inventQuotas : InventQuota[];
  selectedProduct: Product;
  selectedCustomer: Customer;
  customers: Customer[];
  products: Product[] = [];
  data: DataManager;
  salesPersons: UserApp[];
  quotaValue: number = 0;
  productId: string;
  selectedQuota: Quota;
  @ViewChild("grid")
  public grid: GridComponent;
  product: Product;
  constructor(
    private dialogRef: MatDialogRef<QuotaTransferComponent>,
    private productService: ProductService,
    private quotaService: QuotaService,
    private authService: AuthService,
    private userService: UserService,
    private notif: NotificationHelper,
    private customerService: CustomerService,
    private signarlRService: SignalRService,
    private inventSumService : InventSumService,
  ) {}

  async ngOnInit() {
    var orgId = this.authService.profile["organizationId"];
    this.products = await this.productService.getProductsQuota().toPromise();
    this.inventQuotas = await (await this.inventSumService.getProductsForQuota(orgId).toPromise());
    this.salesPersons = await this.userService.getSalesPersons().toPromise();
    this.customers = await this.customerService
      .customerBySalesPerson()
      .toPromise();
  }

  customSearchFn(term: string, item: any) {
    if (term != undefined) {
      term = term.toLocaleLowerCase();
      return (
        (item.code != undefined &&
          item.code.toLocaleLowerCase().indexOf(term) > -1) ||
        item.fullName.toLocaleLowerCase().indexOf(term) > -1
      );
    }
  }
  onClientSelection($event) {}
  load($event) {
    //this.grid.selectRow(0);
  }
  save() {
    var p = this.inventQuotas.find(x=>x.productId == this.productId);
    if (this.quotaValue <= 0) {
      this.notif.showNotification(
        "mat-warn",
        "Quantité doit etre superieure à Zéro",
        "top",
        "right"
      );
      return;
    }
    if(this.destination !=1 && p.physicalDispenseQuantity < this.quotaValue){
      this.notif.showNotification(
        "mat-warn",
        "Quantité produit insuffisante, quantité restante = " +p.physicalDispenseQuantity,
        "top",
        "right"
      );
      return;
    }
    var command = {
      productCode: this.product.code,
      customerId: this.selectedCustomer,
      productName: this.product.fullName,
      productId: this.product.id,
      quantity: this.quotaValue,
      destSalesPersonId: (this.destination ==1)? this.selectedQuota.salesPersonId :null,
      forBuyer: this.destination == 3,
      forSupervisor: this.destination == 2,
    };
    this.quotaService.postRequest(command).subscribe(
      (result) => {
        //console.log(this.quotaId.availableQuantity);
        this.notif.showNotification(
          "mat-success",
          "Demande créée avec succès",
          "top",
          "right"
        );

      },
      (error) => {
        this.notif.showNotification("mat-warn", error, "top", "right");
      }
    );

    this.dialogRef.close(null);
  }
  filterByQnt($evt) {
    if ($evt == null || this.destination < 1) return;
    
    this.data = new DataManager({
      url:
        environment.ResourceServer.Endpoint +
        "quotas/" +
        this.productId +
        "/" +
        $evt,
      adaptor: new UrlAdaptor(),
      headers: [{ Authorization: "Bearer " + this.authService.getToken }],
    });
}
  close() {
    this.dialogRef.close(null);
  }
  rowSelected($event) {
    console.log($event.data);
    this.selectedQuota = $event.data;
    //this.quotaValue = $event.data.availableQuantity;
  }
  onPorductSelection($event) {
    console.log($event);
    this.productId = $event.id;
    this.product = $event;
  }
}
