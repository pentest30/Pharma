import { PermissionService } from "./../../services/permission.service";
import { Component, Inject, OnInit, ViewChild } from "@angular/core";
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import {
  CommandClickEventArgs,
  CommandModel,
  GridComponent,
  SelectionSettingsModel,
} from "@syncfusion/ej2-angular-grids";
import { setCulture } from "@syncfusion/ej2-base";
import { InventQuota } from "src/app/inventory/inventsum/models/quota-invent";
import { AuthService } from "src/app/services/auth.service";
import { ClientService } from "src/app/services/client.service";
import { InventSumService } from "src/app/services/inventory.service";
import { QuotaService } from "src/app/services/quota.service";
import { NotificationHelper } from "src/app/shared/notif-helper";
import { Quota } from "../Models/quota.model";
import { ReservedQuota } from "../Models/reserved.quota.model";
import {
  ConfimDialogComponent,
  ConfirmDialogModel,
} from "src/app/confim-dialog/confim-dialog.component";

@Component({
  selector: "app-quota-add",
  templateUrl: "./quota-add.component.html",
  styleUrls: ["./quota-add.component.sass"],
})
export class QuotaAddComponent implements OnInit {
  inventQuotas: InventQuota[];
  gridLines: string;
  data: any[];
  excludedCustomers: any[] = [];
  customers: any[] = [];
  totalCustomers: number;
  start: number = 1;
  end: number;
  productId: string;
  qntQuota: number = 0;
  dispatched: boolean = false;
  isLoading: boolean = false;
  productSelected: boolean = false;
  date: Date = new Date();
  color = "primary";
  mode = "determinate";
  value = 0;
  hasRecordToday: boolean = false;
  quotaId: any;
  requestId: any;
  isAddingQuota: boolean = false;
  public selectItem: InventQuota;
  @ViewChild("grid")
  public grid: GridComponent;
  public selectOptions: SelectionSettingsModel;
  customerType: number = 1;
  public commandPending: CommandModel[] = [];
  constructor(
    private inventSumService: InventSumService,
    private authService: AuthService,
    private customerService: ClientService,
    private notif: NotificationHelper,
    private quotaService: QuotaService,
    private dialogRef: MatDialogRef<QuotaAddComponent>,
    private permService: PermissionService,
    @Inject(MAT_DIALOG_DATA) private dataModel,
    private dialog: MatDialog
  ) {
    setCulture("fr");
    //loadCldr(require('./../../numbers.json'));
  }

  async ngOnInit() {
    if (this.dataModel.customerCode) {
      this.commandPending = [
        {
          type: "None",
          title: "supprimer",
          buttonOption: { iconCss: "e-icons e-delete", cssClass: "e-flat" },
        },
      ];
      this.isAddingQuota = false;
      this.isLoading = true;
      var orgId = this.authService.profile["organizationId"];
      this.gridLines = "Both";
      this.requestId = this.dataModel.requestId;
      this.data = await this.customerService.getRankedCuotmers().toPromise();
      this.data.forEach((el) => {
        el.quota = 0;
      });
      this.customers = this.data.filter(
        (x) => x.customerCode == this.dataModel.customerCode
      );
      if (this.customers.length > 0) {
        this.inventQuotas = await (
          await this.inventSumService.getProductsForQuota(orgId).toPromise()
        ).filter((x) => x.productCode == this.dataModel.productCode);
        this.productId = this.inventQuotas.find(
          (x) => x.productCode == this.dataModel.productCode
        ).productId;
        this.productSelected = true;
        this.qntQuota = this.dataModel.quantity;
        this.selectOptions = { persistSelection: true, checkboxOnly: true };
        this.totalCustomers = this.customers.length;
        this.start = this.customers.find(
          (x) => x.customerCode == this.dataModel.customerCode
        ).rank;
        this.dispatched = false;
        this.isLoading = false;
        this.quotaId = await this.quotaService
          .getQuotabyProduct(this.productId, this.toShortDate(this.date))
          .toPromise();
        //console.log(this.quotaId);
        this.hasRecordToday = this.quotaId != null;
        this.selectItem = this.inventQuotas[0] as InventQuota;
      } else {
        this.notif.showNotification(
          "mat-success",
          "Client inexistant",
          "top",
          "right"
        );
      }
    } else {
      this.commandPending = [
        {
          type: "None",
          title: "supprimer",
          buttonOption: { iconCss: "e-icons e-delete", cssClass: "e-flat" },
        },
      ];
      this.isLoading = true;
      var orgId = this.authService.profile["organizationId"];
      this.gridLines = "Both";
      this.data = await this.customerService.getRankedCuotmers().toPromise();
      this.data.forEach((el) => {
        el.quota = 0;
      });
      this.customers = this.data.filter(
        (x) => x.customerType == this.customerType
      );
      this.filterRemovedCustomers();

      this.inventQuotas = await this.inventSumService
        .getProductsForQuota(orgId)
        .toPromise();
      this.selectOptions = { persistSelection: true, checkboxOnly: true };
      this.totalCustomers = this.customers.length;
      this.dispatched = false;
      this.isLoading = false;
    }
  }
  // filtrer les clients dèja supprimés par le service vente.
  filterRemovedCustomers() {
    this.removedCustomers = JSON.parse(localStorage.getItem("removed-customers")) || [];
    if (this.removedCustomers.length > 0) {
      for (let index = 0; index < this.removedCustomers.length; index++) {
        const element = this.removedCustomers[index];
        this.customers = this.customers.filter(
          (x) => x.customerId != element.customerId
        );
      }
    }
  }
  onClientTypeChange($event) {
    this.customers = this.data.filter((x) => x.customerType == $event);
    this.totalCustomers = this.customers.length;
    this.start = 1;
  }
  async save() {
    var p = this.inventQuotas.find((x) => x.productId == this.productId);
    if (!this.isAddingQuota) {
      this.isAddingQuota = true;
      let command = new ReservedQuota();
      command.quantityReserved = 0;
      command.productId = this.productId;
      this.customers.forEach((item) => {
        var quota = new Quota();
        quota.productId = this.productId;
        quota.productName = this.selectItem.productFullName;
        quota.productCode = this.selectItem.productCode;
        quota.quotaDate = this.date;
        quota.customerCode = item.customerCode;
        quota.customerId = item.customerId;
        quota.customerName = item.customerName;
        quota.initialQuantity = item.quota;
        quota.salesPersonId = item.defaultSalesPerson;
        quota.salesPersonName = item.salesPersonName;
        if (item.quota > 0) {
          command.quotas.push(quota);
          command.quantityReserved += quota.initialQuantity;
        }
      });

      if (!this.permService.isBuyer()) {
        this.quotaService.post(command).subscribe(
          (result) => {
            //console.log(this.quotaId.availableQuantity);
            this.notif.showNotification(
              "mat-success",
              "Remise mise à jour avec succès",
              "top",
              "right"
            );

            this.dialogRef.close(result);
            this.isLoading = false;
            this.isAddingQuota = false;
          },
          (error) => {
            this.notif.showNotification("mat-warn", error, "top", "right");
            this.isLoading = false;
            this.isAddingQuota = false;
            this.dialogRef.close();
          }
        );
      } else if (
        this.permService.isBuyer() &&
        this.dataModel.requestId != null &&
        command.quotas.find(
          (x) => x.customerCode == this.dataModel.customerCode
        ) &&
        command.quantityReserved <= p.physicalDispenseQuantity
      ) {
        command.requestId = this.dataModel.requestId;
        this.quotaService.post(command).subscribe(
          (result) => {
            this.notif.showNotification(
              "mat-success",
              "Remise mise à jour avec succès",
              "top",
              "right"
            );
            this.dialogRef.close(result);
            this.isLoading = false;
            this.isAddingQuota = false;
          },
          (error) => {
            this.notif.showNotification("mat-warn", error, "top", "right");
            this.isLoading = false;
            this.isAddingQuota = false;
            this.dialogRef.close();
          }
        );
      } else if (
        this.permService.isBuyer() &&
        this.dataModel.requestId != null &&
        command.quotas.find(
          (x) => x.customerCode == this.dataModel.customerCode
        ) &&
        command.quantityReserved > p.physicalDispenseQuantity
      ) {
        debugger;
        this.notif.showNotification(
          "mat-warn",
          "Quantité quota insuffusante, quantité restante = " +
            p.physicalDispenseQuantity,
          "top",
          "right"
        );
        this.isAddingQuota = false;
      } else if (
        this.permService.isBuyer() &&
        this.dataModel.requestId != null &&
        command.quotas.find(
          (x) => x.customerCode == this.dataModel.customerCode
        ) == null
      ) {
        this.notif.showNotification(
          "mat-warn",
          "Demande quota erronée",
          "top",
          "right"
        );
        this.isAddingQuota = false;
      } else if (
        this.permService.isBuyer() &&
        this.dataModel.requestId == null
      ) {
        this.quotaService.post(command).subscribe(
          (result) => {
            //console.log(this.quotaId.availableQuantity);
            this.notif.showNotification(
              "mat-success",
              "Remise mise à jour avec succès",
              "top",
              "right"
            );
            this.isLoading = false;
            this.isAddingQuota = false;
            this.dialogRef.close(result);
          },
          (error) => {
            this.notif.showNotification("mat-warn", error, "top", "right");
            this.isLoading = false;
            this.isAddingQuota = false;
            this.dialogRef.close();
          }
        );
      }
    }
  }
  removedCustomers: any[] = [];
  pendingCommandClick(args: CommandClickEventArgs): void {
    if (args.commandColumn.title == "supprimer") {
      console.log((args.rowData as any).customerId);

      var items = this.removedCustomers.find(
        (x) => x.customerId == (args.rowData as any).customerId
      );

      if (items == undefined || items == null || items.length == 0) {
        this.removedCustomers.push(args.rowData as any);
      }
      console.log(this.removedCustomers);
      this.customers = this.customers.filter(
        (x) => x.customerId != (args.rowData as any).customerId
      );
      this.customers.forEach((el) => {
        el.quota = 0;
      });
      if (this.dispatched) this.dispatch();
      this.grid.dataSource = this.customers;
      this.grid.refresh();
      localStorage.setItem(
        "removed-customers",
        JSON.stringify(this.removedCustomers)
      );
    }
  }
  onStartChange(event) {
    this.onChange(event);
  }
  customProductSearchFn(term: string, item: any) {
    if (term != undefined) {
      term = term.toLocaleLowerCase();
      return (
        (item.productCode != undefined &&
          item.productCode.toLocaleLowerCase().indexOf(term) > -1) ||
        (item.manufacturer != undefined &&
          item.manufacturer.toLocaleLowerCase().indexOf(term) > -1) ||
        item.productFullName.toLocaleLowerCase().indexOf(term) > -1
      );
    }
  }
  async release() {
    var response = await this.confirmDialog(
      "Est-vous sûr de vouloir libérer cette quantité"
    );
    if (response) {
      this.quotaService
        .put({ id: this.selectItem.productId, date: this.date })
        .subscribe(
          (result) => {
            this.notif.showNotification(
              "mat-success",
              "Mise à jours terminée avec succéss",
              "top",
              "right"
            );
            this.hasRecordToday = false;
          },
          (error) => {
            this.notif.showNotification("mat-warn", error, "top", "right");
          }
        );
      var orgId = this.authService.profile["organizationId"];
      this.inventQuotas =  await this.inventSumService
        .getProductsForQuota(orgId)
        .toPromise();
      var p = this.inventQuotas.find((x) => x.productId == this.productId);
      this.qntQuota = p.physicalDispenseQuantity;
    }
  }
  onQuotaChange(event) {
    //console.log(this.productId);
    var p = this.inventQuotas.find((x) => x.productId == this.productId);
    if (p && this.qntQuota > p.physicalDispenseQuantity) {
      this.qntQuota = p.physicalDispenseQuantity;
      this.notif.showNotification(
        "mat-warn",
        "Le quota ne doit pas être superieure à la quntité disponible",
        "top",
        "right"
      );
      return;
    }
  }
  onChange(event) {
    let customers = [];
    this.customers = this.data.filter(
      (x) => x.customerType == this.customerType
    );
    let s = this.start - 1;
    let e = this.totalCustomers + s;
    for (let index = s; index < e; index++) {
      const element = this.customers[index];
      if (element) customers.push(element);
    }

    this.grid.dataSource = customers;
    this.grid.refresh();
    this.customers = customers;
  }
  dispatch() {
    var totalAmount = 0;
    var dispatchedQnt = 0;
   
   
    this.customers.forEach((element) => {
      totalAmount += element.totalAmount;
    });
    // calculer le pourcentage de la quantité  à attribuer pour chaque element
    this.customers.forEach((element) => {
      var qntPrc = (element.totalAmount * 100) / totalAmount;
      element.quota = Math.floor((qntPrc * this.qntQuota) / 100);
      dispatchedQnt += element.quota;
    });
    // attribuer la quantité restante.
    let remainedQnt = this.qntQuota - dispatchedQnt;
    while (remainedQnt > 0) {
      this.customers.forEach((element) => {
        if (remainedQnt == 0) return;
        element.quota += 1;
        remainedQnt -= 1;
      });
    }

    this.grid.dataSource = this.customers;
    this.grid.refresh();
    this.dispatched = true;
    var total = 0;
    for (let index = 0; index < this.customers.length; index++) {
      const element = this.customers[index];
      total += parseInt(element.quota);
    }
    //alert(total);
  }
  async confirmDialog(message, focusNo: boolean = true) {
    const dialogData = new ConfirmDialogModel(
      "Avertissement",
      message,
      focusNo
    );
    const dialogRef = this.dialog.open(ConfimDialogComponent, {
      maxWidth: "400px",
      data: dialogData,
    });

    let dialogResult = await dialogRef.afterClosed().toPromise();
    if (dialogResult) return true;
    else return false;
  }
  rowSelected(event) {
    this.excludedCustomers.push(event.data);
    //console.log(this.excludedCustomers);
  }
  async setToDate(date) {
    this.quotaId = await this.quotaService
      .getQuotabyProduct(this.selectItem.productId, this.toShortDate(date))
      .toPromise();
    this.hasRecordToday = this.quotaId != null;
  }
  async onProductSelection(event) {
    this.qntQuota = event.physicalDispenseQuantity;
    this.quotaId = await this.quotaService
      .getQuotabyProduct(event.productId, this.toShortDate(this.date))
      .toPromise();
    //console.log(this.quotaId);
    this.hasRecordToday = this.quotaId != null;
    this.selectItem = event as InventQuota;
  }
  toShortDate(date) {
    if (!date) return null;
    return (
      date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear()
    );
  }
  close() {
    this.dialogRef.close();
  }
}
