import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { GridComponent, RowSelectEventArgs, SelectionSettingsModel } from '@syncfusion/ej2-angular-grids';
import { DataManager, UrlAdaptor, Query, ODataAdaptor, Predicate, ReturnOption } from "@syncfusion/ej2-data";
import { AuthService } from 'src/app/services/auth.service';
import { OrdersService } from 'src/app/services/orders.service';
import { PermissionService } from 'src/app/services/permission.service';
import { PreparationOrdersService } from 'src/app/services/preparation-orders.service';
import { BaseComponent } from 'src/app/shared/BaseComponent';
import { ErrorParseHelper, Result } from 'src/app/shared/helpers/ErrorParseHelper';
import { NotificationHelper } from 'src/app/shared/notif-helper';
import { environment } from 'src/environments/environment';
import { PreparationOrderDetailComponent } from '../preparation-order-detail/preparation-order-detail.component';
import { PreparationOrderEditionComponent } from '../preparation-order-edition/preparation-order-edition.component';

@Component({
  selector: 'app-listing-preparation-orders',
  templateUrl: './listing-preparation-orders.component.html',
  styleUrls: ['./listing-preparation-orders.component.sass']
})
export class ListingPreparationOrdersComponent extends BaseComponent implements OnInit {
  gridLines: string;
  data: DataManager;
  filters: object = {};
  @ViewChild('grid') public grid: GridComponent;
  isOpen: any;
  barCode: string = "";
  EditByScan: boolean = false;
  barcodeFormControl = new FormControl();
  loading: boolean = false;
  pageSettings = { pageSizes: true, pageSize: 12 };
  constructor(
    private authService: AuthService,
    private orderPreparationService: PreparationOrdersService,
    private orderService: OrdersService,

    private notif: NotificationHelper,
    private dialog: MatDialog,
    private parseErrorHelper: ErrorParseHelper,
  ) {
    super(authService, "preparationOrders/");
  }

  ngOnInit(): void {
    this.loadData();
    this.selectionOptions = { checkboxMode: 'ResetOnRowClick' };
  }
  async loadData() {
    let profile = await this.authService.getUser();
    console.log(profile);
    this.data = new DataManager({
      url: environment.ResourceServer.Endpoint + "orders/" + profile.organizationId + "/printingAgent/v1",
      adaptor: new UrlAdaptor(),
      headers: [{ Authorization: "Bearer " + this.token }],
    });

  }
  async printBl(row) {
    this.loading = true;
    let response = await this.orderPreparationService.printBl(row.id).toPromise();
    if (response == null) {
      this.notif.showNotification("mat-success", " Ordre de préparation " + row.orderNumber + " est imprimé avec succès", 'top', 'right');


    } else {
      let resultError = this.parseErrorHelper.parse(<Result>response);
      this.notif.showNotification('mat-warn', 'Echec d\'impression ' + resultError, 'top', 'right');

    }

    this.loading = false;
  }
  async print(row) {
    this.loading = true;
    let response = await this.orderPreparationService.print({ ordersIds: [row.id] }).toPromise();
    if (response == null) {
      this.notif.showNotification("mat-success", " Ordre de préparation " + row.orderNumber + " est imprimé avec succès", 'top', 'right');


    } else {
      let resultError = this.parseErrorHelper.parse(<Result>response);
      this.notif.showNotification('mat-warn', 'Echec d\'impression :' + resultError, 'top', 'right');

    }
    this.loadData();
    this.loading = false;
  }
  async printSelectedBl() {
    this.loading = true;
    const selectedrecords: any[] = this.grid.getSelectedRecords();  // Get the selected records.
    let Bls = [];
    for (let index = 0; index < selectedrecords.length; index++) {
      const element = selectedrecords[index];
      // Bls.push(element.id);
      console.log(element);
      Bls.push(element.orderId);

    }
    // await this.orderPreparationService.PrintBulkBl({ids : Bls}).toPromise();
    var result =await this.orderPreparationService.print({ordersIds : Bls}).toPromise();
    if(result==null)
    {

    this.notif.showNotification('mat-primary',"BLs Selectionnés Imprimés avec succès",'top','right');

    }
    else{

        let resultError = this.parseErrorHelper.parse(<Result>result);
        this.notif.showNotification('mat-warn',resultError,'top','right');
    }
    this.loading = false;
    this.loadData();

  }
  async printPendingBl() {
    this.loading = true;

    await this.orderPreparationService.printPendingBl(this.filters).toPromise();
    this.notif.showNotification('mat-primary', "BLs en attente Imprimés avec succès", 'top', 'right');
    this.loadData();
    this.loading = false;

  }
  rowSelected(args: RowSelectEventArgs) {
    console.log(args.data);
    if (this.EditByScan) {
      console.log(this.grid.getSelectedRecords());
      const selectedrecords: object[] = this.grid.getSelectedRecords();  // Get the selected records.
      console.log(selectedrecords);
      if (selectedrecords) this.edit(selectedrecords.shift());

    }

  }
  async view(order) {
    var Bl = await this.orderPreparationService.getById(order.id).toPromise();
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      bl: Bl,
      pickingZoneId: null,
    };
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.maxWidth = '100vw';
    dialogConfig.maxHeight = "100vh";
    dialogConfig.height = "100%";
    dialogConfig.width = "100%";
    dialogConfig.panelClass = 'full-screen-modal';
    if (!this.isOpen) {
      var modalRef = this.dialog.open(PreparationOrderDetailComponent, dialogConfig);
      this.isOpen = true;
      modalRef.afterClosed().subscribe(res => {
        this.isOpen = false;

      });
    }
  }

  async edit(order) {
    var Bl = await this.orderPreparationService.getById(order.id).toPromise();
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      bl: Bl,
    };
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.maxWidth = '100vw';
    dialogConfig.maxHeight = "100vh";
    dialogConfig.height = "100%";
    dialogConfig.width = "100%";
    dialogConfig.panelClass = 'full-screen-modal'
    if (!this.isOpen) {
      var modalRef = this.dialog.open(PreparationOrderEditionComponent, dialogConfig);
      this.isOpen = true;
      this.EditByScan = false;
      this.barcodeFormControl.setValue("");
      this.barCode = '';
      modalRef.afterClosed().subscribe(res => {
        this.isOpen = false;
        this.loadData();
      });
    }
  }
  async getEditZone(barCode) {
    this.barCode = barCode;
    this.loadData();
    console.log(this.data);
    this.grid.selectedRowIndex = 0;

    this.EditByScan = true;
  }
}
